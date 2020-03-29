const Router = require('koa-router');
const router = new Router();
const mongoose = require('mongoose');


//用户提交评价
router.post('/submitComments', async (ctx) => {
  let commentList = ctx.request.body.commentList;
  let orderId = ctx.request.body.orderId;
  console.log('[提交评价-前端数据]', commentList, orderId);
  const Comments = mongoose.model('Comments');

  let proArr = commentList.map(item => {
    let newComment = new Comments(item);
    return new Promise((resolve, reject) => {
      newComment.save()
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  });
  try {
    await Promise.all(proArr)
    const Orders = mongoose.model('Orders');
    await Orders.findOneAndUpdate({
      'orderId': orderId
    }, {
      $set: {
        isComment: true
      }
    }, {
      upsert: true
    })
    ctx.body = {
      code: 200,
      message: '保存成功'
    }
  } catch (err) {
    console.log(err)
    ctx.body = {
      code: 500,
      message: err
    }
  }
})

//通过用户名查询用户评价
router.get('/getUserComments', async (ctx) => {
  let userName = ctx.query.userName;
  console.log('[查询用户评价-前端]', userName)
  const Comments = mongoose.model('Comments');
  try {
    let res = await Comments.find({
      userName: userName
    }).exec()

    ctx.body = {
      code: 200,
      message: res
    }
  } catch (err) {
    ctx.body = {
      code: 500,
      message: err
    }
  }
})

//通过商品id查询商品评价
router.get('/getGoodsComments', async (ctx) => {
  let goodsId = ctx.query.goodsId;
  console.log('[查询商品评价-前端]', goodsId)
  const Comments = mongoose.model('Comments');
  try {
    let res = await Comments.find({
      goodsId: goodsId
    }).exec()

    ctx.body = {
      code: 200,
      message: res
    }
  } catch (err) {
    ctx.body = {
      code: 500,
      message: err
    }
  }
})

module.exports = router
