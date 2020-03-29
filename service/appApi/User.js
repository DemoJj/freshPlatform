const Router = require('koa-router')
let router = new Router()
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')

//注册
router.post('/register', async (ctx) => {
  //取得model（集合）
  const User = mongoose.model('User')
  //把从前端接收到的POST数据封装成一个新的user对象
  let newUser = new User(ctx.request.body)
  let {
    username
  } = ctx.request.body
  //用mongoose的save方法直接存储，然后判断是否成功，返回相应的结果
  await newUser.save()
    .then(() => {
      //成功返回code=200，并返回成功信息
      ctx.body = {
        code: 200,
        message: '注册成功',
        userInfo: {
          username,
          addressList:[],
          cartList:[]
        }
      }
    })
    .catch(error => {
      //失败返回code=500，并返回错误信息
      ctx.body = {
        code: 500,
        message: error
      }
    })
})

//登录
router.post('/login', async (ctx) => {
  //得到前端传递过来的数据
  let loginUser = ctx.request.body
  console.log('[userApi]前端传递过来的数据：', loginUser)
  let username = loginUser.username
  let password = loginUser.password
  //引入User的model
  const User = mongoose.model('User')
  //查找用户名是否存在，如果存在开始比对密码
  await User.findOne({
      username: username
    }).exec()
    .then(async (result) => {
      console.log('[userApi]查询成功后的数据：', result)
      if (result) {
        //当用户名存在时，开始比对密码
        let newUser = new User()
        await newUser.comparePassword(password, result.password)
          .then((isMatch) => {
            console.log('[userApi]密码比对结果：', isMatch)
            //返回token
            const token = jwt.sign({
              id: result._id
            }, 'demoJx')
            let userInfo = {
              username: result.username,
              userimg: result.userimg,
              addressList:result.addresslist,
              cartList:result.cartlist
            }
            // console.log('[userApi]用户信息返回：',userInfo)
            //返回比对结果
            ctx.body = {
              code: 200,
              message: isMatch,
              token: token,
              userInfo
            }
          })
          .catch(error => {
            console.log('[userApi]密码比对报错：', error)
            ctx.body = {
              code: 500,
              message: error
            }
          })
      } else {
        ctx.body = {
          code: 200,
          message: '用户不存在'
        }
      }
    })
    .catch(error => {
      console.log('[userApi]用户查询报错：', error)
      ctx.body = {
        code: 500,
        message: error
      }
    })

})

//修改用户信息
router.post('/setUserInfo', async (ctx) => {
  //得到前端传递过来的数据
  let userInfo = ctx.request.body;
  console.log('[userApi]前端传递过来的数据：', userInfo);
  let username = userInfo.username;
  let userimg = userInfo.userimg;
  if (typeof userimg != 'undefined') {
    const User = mongoose.model('User');
    await User.update({
        username: username
      }, {
        "$set": {
          userimg: userimg
        }
      })
      .then(result => {
        console.log('[userApi]更新成功', result)
      }).catch(err => {
        console.log('[userApi]更新失败', err)
      })
    ctx.body = {
      code: 200
    }
  } else {
    ctx.body = {
      code: 500,
      message: '参数不足'
    }
  }
})

//获取七牛云凭证
router.get('/getQiniuToken', (ctx) => {
  delete require.cache[require.resolve('../qiniu_config.js')];
  const qnconfig = require('../qiniu_config.js')
  ctx.body = {
    status: 200,
    qnToken: qnconfig.uploadToken
  }
})

//获取用户收货地址信息
router.get('/getUserAddress', async (ctx) => {
  //得到前端传递过来的数据
  let userInfo = ctx.query;
  const User = mongoose.model('User');
  await User.findOne({
    username: userInfo.userName
  }).exec().then(response => {
    ctx.body = {
      status: 200,
      message: response.addresslist
    }
  }).catch(err => {
    ctx.body = {
      status: 500,
      message: err
    }
  })

})

//更新用户收货地址信息
router.post('/updateUserAddress', async (ctx) => {
  //得到前端传递过来的数据
  let userInfo = ctx.request.body;
  console.log('[userApi]前端传递过来的数据：', userInfo);

  const User = mongoose.model('User');

  await User.update({
    username: userInfo.userName
  }, {
    $set: {
      addresslist: userInfo.addressList
    }
  }, {
    upsert: true
  }).then(response => {
    if (response.ok == 1) {
      ctx.body = {
        status: 200,
        message: '保存数据成功'
      }
    }
  }).catch(err => {
    ctx.body = {
      status: 500,
      message: err
    }
  })
})


//获取用户购物车信息
router.get('/getUserCart', async (ctx) => {
    let userInfo = ctx.query;
    const User = mongoose.model('User');
    await User.findOne({username:userInfo.userName}).exec()
    .then(response=>{
        ctx.body= {
            status:200,
            message:response
        }
    })
    .catch(err=>{
        ctx.body= {
            status:500,
            message:err
        }
    })
})

//更新用户购物车信息
router.post('/updateUserCart', async (ctx) => {
  let userInfo = ctx.request.body;
  console.log('[购物车前端信息]', userInfo);

  const User = mongoose.model('User');
  await User.update({
    username: userInfo.userName
  }, {
    $set: {
      cartlist: userInfo.cartInfo
    }
  }, {
    upsert: true
  }).then(response => {
    ctx.body = {
      status: 200,
      message: '购物车数据保存成功'
    }
  }).catch(err => {
    ctx.body = {
      status: 500,
      message: err
    }
  })


})

//头像保存
router.post('/saveImg',async(ctx)=>{
  let form = new formidable.IncomingForm();
 // 设置存储文件的目录
 const imgPath = path.join(__dirname, '../imgStore')
 // 如果目录不存在则创建
 if (!fs.existsSync(imgPath)) fs.mkdirSync(imgPath)
 form.uploadDir = imgPath
 // 上传文件大小限制
 form.maxFieldsSize = 20 * 1024 * 1024

 let result = await new Promise(r => {
     form.parse(ctx.req, function (err, fields, files) {
         if (err) {
             r({ err })
         } else {
           console.log(fields.key)
           console.log(files.file.path)
             // 手动给文件加后缀, formidable默认保存的文件是无后缀的
             let newPath = imgPath +'/'+ fields.key
             fs.renameSync(files.file.path, newPath)
             r({ path: fields.key })
         }
     })
 })
 const basename = '/' + path.basename(result.path)
 if (result.err) ctx.throw(400, '异常错误')
 else ctx.body = {
   key:result.path
 }
})

module.exports = router;
