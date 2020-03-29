const mongoose = require('mongoose') //引入Mongoose
const Schema = mongoose.Schema //声明Schema
let ObjectId = Schema.Types.ObjectId //声明Object类型
const bcrypt = require('bcrypt') //加密加盐处理
const SALT_WORK_FACTOR = 10

//创建我们的用户Schema (相当于建表)
const userSchema = new Schema({
    UserId:ObjectId,//主键
    username:{unique:true,type:String},
    userimg:String,
    password:String,
    createAt:{type:Date,default:Date.now()},
    lastLoginAt:{type:Date,default:Date.now()},
    cartlist:Array,
    addresslist:Array
},{
    collection:'users'
})

//加密加盐处理-每次存储数据时都要执行 genSalt-创盐 SALT_WORK_FACTOR-盐工作要素
userSchema.pre('save',function(next){
    //let user = this
    console.log(this)
    bcrypt.genSalt( SALT_WORK_FACTOR,(err,salt)=>{
        if(err) return next(err)
        bcrypt.hash(this.password,salt,(err,hash)=>{
            if(err) return next(err)
            this.password = hash
            next()
        })
    })
})


userSchema.methods = {
    //密码比对方法
    comparePassword:(_password,password)=>{
        return new Promise((resolve,reject)=>{
            bcrypt.compare(_password,password,(err,isMatch)=>{
                if(!err) resolve(isMatch)
                else reject(err)
            })
        })
    }
}
//发布模型
mongoose.model('User',userSchema)