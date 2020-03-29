const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mainGoodsSchema = new Schema({
    ID:{unique:true,type:String},
    "advertesPicture":Object,
    "floor3":Array,
    "floor2":Array,
    "floorName":Object,
    "floor1":Array,
    "category":Array,
    "slides":Array,
    "hotGoods":Array,
    "recommend":Array,
    "sendFee":Object
})
mongoose.model('MainGoods',mainGoodsSchema)
