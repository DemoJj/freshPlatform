const mongoose = require('mongoose')
const db = "mongodb://localhost/simle-db" //simle-db为集合名字

// glob：node的glob模块允许你使用 * 等符号，来写一个glob规则，像在shell里一样，获取匹配对应规则文件。
// resolve: 将一系列路径或路径段解析为绝对路径。
const glob = require('glob')
const {resolve} = require('path')

//glob.sync同步引入
exports.initSchemas = ()=>{
    glob.sync(resolve(__dirname,'./schema/','**/*.js')).forEach(require)
}

// Use native promises
mongoose.Promise = global.Promise

exports.connect = () => {
  //连接数据库
  mongoose.set('useCreateIndex', true)
  mongoose.set('useFindAndModify', false);
  mongoose.connect(db)

  console.log('当前:',__dirname)
  console.log('运行:',process.cwd())

  //连接次数
  let maxConnectTimes = 0

  return new Promise((resolve, reject) => {
    //增加数据库连接的事件监听
    mongoose.connection.on('disconnected', () => {
      console.log('*****数据库断开*****')
      if (maxConnectTimes < 3) {
        maxConnectTimes++
        //进行重连
        mongoose.connect(db)
      } else {
        reject()
        throw new Error('数据库出现问题，程序无法完成，请检查......')
      }
    })

    //数据库出现错误的时候
    mongoose.connection.on('error', err => {
      console.log('*****数据库错误*****')
        if(maxConnectTimes<3){
            maxConnectTimes++
            mongoose.connect(db)
        }else {
            reject(err)
            throw new Error('数据库出现问题，程序无法完成，请检查......')
        }
    })

    //链接打开的时候
    mongoose.connection.on('open', () => {
      console.log('MongoDB Connected Successfully!')
      resolve()
    })
  })

}
