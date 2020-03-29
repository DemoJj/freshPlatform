const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderId:{unique:true,type:String},
    userName:String,
    orderGoods:Array,
    orderAddress:Object,
    orderTotalMoney:Number,
    orderStatus:String,
    createTime:{type:Date,default:Date.now()},
    payType:String,
    isComment:Boolean
},{
    collation:'orders'
})

mongoose.model('Orders',orderSchema)