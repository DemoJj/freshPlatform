const Router = require('koa-router');
const router = new Router();
const mongoose = require('mongoose');

//生成订单编号
function createOrderId(){
  let nowDate = Date.now();
  let randNumber = parseInt(Math.random()*(99999-10000)+10000);
  return String(nowDate) + String(randNumber);
}

//提交订单
router.post('/submitOrder', async (ctx) => {
  let orderInfo = ctx.request.body;
  console.log('[提交订单前端]', orderInfo);
  const Orders = mongoose.model('Orders');
  orderInfo = Object.assign({},orderInfo,{orderId:createOrderId()})
  let newOrder = new Orders(orderInfo);
  await newOrder.save().then(res => {
    ctx.body = {
      status: 200,
      message: '订单保存成功'
    }
  }).catch(err => {
    ctx.body = {
      status: 500,
      message: err
    }
  })

})

//根据用户名获取所有订单
router.post('/getOrderList',async(ctx)=>{
  let userName = ctx.request.body.userName;
  console.log('[获取订单前端数据]', userName);
  const Orders = mongoose.model('Orders');
  await Orders.find({'userName':userName}).exec()
  .then(res=>{
    // console.log('[数据库返回数据]',res)
    ctx.body = {
      status: 200,
      message: res
    }
  }).catch(err=>{
    ctx.body = {
      status: 500,
      message: err
    }
  })
})

//获取指定天数内数据
router.get('/getOrdersForDate',async(ctx)=>{
  let dateNum = ctx.query.num;
  const Orders = mongoose.model('Orders');
  try {
    let oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - dateNum);
    let res = await Orders.find({"createTime":{$gte:oldDate}}).exec();
    
    ctx.body = res
  }catch(err){
    ctx.body = err
  }
})
module.exports = router
