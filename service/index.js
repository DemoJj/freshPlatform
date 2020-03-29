const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const {connect , initSchemas} = require('./database/init.js')//引入connect
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const path = require('path');
const staticCache = require('koa-static-cache')
app.use(bodyParser())
app.use(cors())

app.use(staticCache(path.join(__dirname,'imgStore'),{
    maxAge:365*24*60*60,
    gzip:true,
    buffer:true,
    dynamic:true
}))

//--------立即执行函数(链接数据库)
;(async()=>{
    await connect()
    initSchemas()
    // const User = mongoose.model('User') //集合名字从这里自动改造创建，这里User变成users
    // let oneUser = new User({userNfame:'demoJx3',password:'1234567'})
    // oneUser.save().then(()=>{
    //     console.log('插入成功')
    // })
    // let users = await User.find({}).exec()
    // console.log('-------------')
    // console.log(users)
    // console.log('-------------')
})()

//------引入路由模块
let user = require('./appApi/User.js')
let goods = require('./appApi/goods.js')
let orders = require('./appApi/Orders.js')
let comments = require('./appApi/Comments.js')

//装载所有子路由
let router = new Router()
router.use('/user',user.routes())
router.use('/goods',goods.routes())
router.use('/orders',orders.routes())
router.use('/comments',comments.routes())


//加载路由中间件
app.use(router.routes())
app.use(router.allowedMethods())


app.use(async(ctx)=>{
    ctx.body = '<h1>Hello Koa2!</h1>'
})
app.listen(3000,()=>{
    console.log('[Server] starting at port 3000')
})

