const Router = require('koa-router')
let router = new Router()

const mongoose = require('mongoose')
const fs = require('fs')

//商品首页内容插入数据库
router.get('/insertAllMainGoods',async(ctx)=>{
    fs.readFile('./data_json/mainGoods.json','utf8',function(err,data){
        if(err)return console.log(err)
        let newData = JSON.parse(data).data;
        const MainGoods = mongoose.model('MainGoods');
        let newMainGoods = new MainGoods(newData);
        newMainGoods.save().then(()=>{
            console.log('成功')
        }).catch(err=>{
            console.log('失败',err)
        })
    })
    ctx.body = '导入数据中。。。'
})

//商品信息插入数据库
router.get('/insertAllGoodsInfo',async(ctx)=>{
    // fs.readFile('./newGoods.json','utf8',function(err,data){ //该路径相对于引用该文件的js（这里相对于index.js）
    //     let newData = JSON.parse(data)
    //     let saveCount = 0
    //     const Goods = mongoose.model('Goods')
    //     newData.map((value,index)=>{
    //         console.log('[demo]'+saveCount+value)
    //         let newGoods = new Goods(value)
    //         newGoods.save().then(()=>{
    //             saveCount++
    //             console.log('成功'+saveCount)
    //         }).catch(error=>{
    //             console.log('失败'+err)
    //         })
    //     })
    // })
    // ctx.body = '开始导入数据'
})

//商品大类插入数据库
router.get('/insertAllCategory',async(ctx)=>{
    // fs.readFile('./data_json/category.json','utf8',(err,data)=>{
    //     data = JSON.parse(data)
    //     let saveCount = 0
    //     const Category = mongoose.model('Category')
    //     data.RECORDS.map((value,index)=>{
    //         console.log(value)
    //         let newCategory = new Category(value)
    //         newCategory.save().then(()=>{
    //             saveCount++
    //             console.log('成功'+saveCount)
    //         }).catch(error=>{
    //             console.log('失败'+err)
    //         })
    //     })
    // })
    // ctx.body="开始导入数据"
    // ctx.body="开始导入数据..."
})

//商品子类插入数据库
router.get('/insertAllCategorySub',async(ctx)=>{
    // fs.readFile('./data_json/category_sub.json','utf8',(err,data)=>{
    //     data = JSON.parse(data)
    //     let saveCount = 0
    //     const CategorySub = mongoose.model('CategorySub')
    //     data.RECORDS.map((value,index)=>{
    //         let newCategorySub = new CategorySub(value)
    //         newCategorySub.save().then(()=>{
    //             saveCount++
    //             console.log('成功'+saveCount)
    //         }).catch(err=>{
    //             console.log('失败'+err)
    //         })
    //     })
    // })
    // ctx.body="开始导入数据..."
})

//获取首页商品信息
router.get('/getMainGoods',async(ctx)=>{
    try{
        const mainGoods = mongoose.model('MainGoods')
        let result = await mainGoods.find()
        ctx.body = {code:200,message:result}
    }catch(err){
        ctx.body = {code:500,message:err}
    }
})

//获取商品详细信息接口
router.post('/getDetailGoodsInfo',async(ctx)=>{
    try{
        let goodsId = ctx.request.body.goodsId
        const Goods = mongoose.model('Goods')
        let result = await Goods.findOne({ID:goodsId}).exec()
        ctx.body = {code:200,message:result}
    }catch(err){
        ctx.body = {code:500,message:err}
    }
})

//获取商品大类信息接口
router.get('/getCategoryList',async(ctx)=>{
    try{
        const Category = mongoose.model('Category')
        let result = await Category.find().exec()
        ctx.body = {code:200,message:result}
    }catch(error){
        ctx.body = {code:500,message:error}
    }
})

//获取商品小类信息接口
router.post('/getCategorySubList',async(ctx)=>{
    try{
        let categoryId = ctx.request.body.categoryId
        //let categoryId = 2
        const CategorySub = mongoose.model('CategorySub')
        let result = await CategorySub.find({MALL_CATEGORY_ID:categoryId}).exec()
        ctx.body = {code:200,message:result}
    }catch(error){
        ctx.body = {code:500,message:error}
    }
})

//根据 商品类别 获取商品列表接口(分页获取)
router.post('/getGoodsListByCategorySubID',async(ctx)=>{
    try{
        let categorySubId = ctx.request.body.categorySubId
        //let categorySubId = '2c9f6c946016ea9b016016f79c8e0000'
        let page = ctx.request.body.page
        let num = 10//每页显示数量
        let start = (page-1)*num
        const Goods = mongoose.model('Goods')
        let result = await Goods.find({SUB_ID:categorySubId})
        .skip(start).limit(num).exec()
        //console.log(result)
        ctx.body = {code:200,message:result}
    }catch(error){
        ctx.body = {code:500,message:error}
    }
})

//商品搜索
router.post('/searchGoods',async(ctx)=>{
    const searchVal = ctx.request.body.searchVal;
    const Goods = mongoose.model('Goods');
    await Goods.find({NAME:{$regex:`.*${searchVal}.*`}}).exec()
    .then(response=>{
        ctx.body = {code:200,message:response}
    })
    .catch(error=>{
        ctx.body = {code:500,message:error}
    })
})

module.exports = router