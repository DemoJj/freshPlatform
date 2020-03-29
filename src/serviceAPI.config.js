const BASEURL =  "https://mockapi.eolinker.com/YfWKCnfc5f0e96392ef8fae11de7e133383a188b7415997/smileVue/"
// const LOCALURL = "http://localhost:3000/"
const LOCALURL = "/api"
const qiniuaddr = "q4524o2tk.bkt.clouddn.com"

const url = {
    getShoppingMallInfo:LOCALURL + 'goods/getMainGoods',
    getGoodsInfo:BASEURL + 'getGoodsInfo',
    registerUser:LOCALURL + 'user/register', //用户注册接口
    loginUser:LOCALURL + 'user/login', //用户登录接口 
    setUserInfo:LOCALURL + 'user/setUserInfo', //修改用户信息
    updateUserAddress:LOCALURL + 'user/updateUserAddress',//更新用户地址接口
    getUserAddress:LOCALURL + 'user/getUserAddress',//获取用户地址接口
    updateUserCart:LOCALURL + 'user/updateUserCart',//更新用户购物车信息
    getUserCart:LOCALURL + 'user/getUserCart',//获取用户购物车信息
    saveImg:LOCALURL + 'user/saveImg',//保存图片
    
    getDetailGoodsInfo:LOCALURL + 'goods/getDetailGoodsInfo',//获取商品信息接口
    getCategoryList:LOCALURL + 'goods/getCategoryList', //获取大类信息
    getCategorySubList:LOCALURL + 'goods/getCategorySubList',//获取小类信息
    getGoodsListByCategorySubID:LOCALURL + 'goods/getGoodsListByCategorySubID',//得到小类商品信息
    searchGoods:LOCALURL + 'goods/searchGoods',//商品搜索

    getQiniuToken:LOCALURL+'user/getQiniuToken',//获取七牛云凭证
    // qiniuaddr:qiniuaddr,//七牛云域名地址
    qiniuaddr:window.location.hostname+LOCALURL,//七牛云域名地址

    submitOrder:LOCALURL+'orders/submitOrder',//提交订单
    getOrderList:LOCALURL+'orders/getOrderList',//根据用户名获取所有订单

    submitComments:LOCALURL + 'comments/submitComments',//用户提交评价
    getUserComments:LOCALURL + 'comments/getUserComments',//查询用户评价
    getGoodsComments:LOCALURL + 'comments/getGoodsComments',//查询商品评价
}
module.exports = url