import request from "../../utils/request.js";
import url from "@/serviceAPI.config.js";

const cart = {
  state: {
    userInfo: {
      username: '',
      userimg:'',
      cartList: [],
      addressList: []
    },
    count: 0
  },
  mutations: {
    //设置用户信息
    set_userInfo(state, info) {
      state.userInfo = info;
    },
    //设置购物车信息
    set_cartInfo(state, info) {
      state.userInfo.cartList = info;
    },
    //设置地址信息
    set_addressList(state, info) {
      state.userInfo.addressList = info;
    },
    //初始化数据
    init_state(state){
      state.userInfo = {
        username: '',
        userimg:'',
        cartList: [],
        addressList: []
      };
    }
  },
  actions: {
    //更新购物车信息
    async updateCartList(context) {
      let data = {
        cartInfo: context.state.userInfo.cartList,
        userName: context.state.userInfo.username
      }
      let res = await request({
        url: url.updateUserCart,
        method: "post",
        data: data
      });
    },
    //获取购物车信息
    async getCartInfo(context) {
      let res = await request({
        url: url.getUserCart,
        method: "get",
        params: {
          userName: context.state.userInfo.userName
        }
      });
      context.commit('set_cartInfo', res.message.cartlist);
    },
    //更新用户地址
    async updateAddress(context){
          let data = {
            addressList: context.state.userInfo.addressList,
            userName: context.state.userInfo.username
          }
          let res = await request({
            url: url.updateUserAddress,
            method: "post",
            data: data
          });
    }
  }
}

export default cart
