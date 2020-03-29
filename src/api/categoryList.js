import request from '../utils/request'
import url from '../serviceAPI.config'



//获取大类信息
export function getCategory() {
  return request({
    url: url.getCategoryList,
    method: "get"
  })
}

//获取小类信息
export function getCategorySub(categoryId) {
  return request({
    url: url.getCategorySubList,
    method: "post",
    data: {
      categoryId: categoryId
    }
  })
}

//获取子类商品信息
export function getGoodsList(categorySubId,page) {
  return request({
    url: url.getGoodsListByCategorySubID,
    method: "post",
    data: {
      categorySubId: categorySubId,
      page: page
    }
  })
}
