const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    "userName":String,
    "userImg":String,
    "goodsId":String,
    "goodsName":String,
    "goodsImg":String,
    "level":Number,
    "content":String,
    "date":{type:Date,default:Date.now()}
},{
    collation:'comments'
})

mongoose.model('Comments',commentSchema);
