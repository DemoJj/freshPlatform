<template>
  <div>
    <div class="navbar-div">
      <van-nav-bar title="购物车"></van-nav-bar>
    </div>
    <!-- 显示购物车商品 -->
    <div class="cart-list">
      <div>
        <div v-for="(item,index) in cartInfo" :key="index">
          <van-swipe-cell :before-close="beforeClose" :name="index">
            <div class="cartList-row">
              <div class="cartList-row-img">
                <img :src="item.image" width="100%" :onerror="errImg" />
              </div>
              <div class="cartList-row-text">
                <div class="cartList-goodsname">{{item.Name}}</div>
                <div class="cartList-control">
                  <van-stepper v-model="item.count"></van-stepper>
                </div>
              </div>
              <div class="cartList-row-price">
                <div>￥{{item.price | moneyFilter}}</div>
                <div>x{{item.count}}</div>
                <div class="allPrice">￥{{item.price*item.count | moneyFilter}}</div>
              </div>
            </div>

            <template slot="right">
              <van-button square type="danger" text="删除" />
            </template>
          </van-swipe-cell>
        </div>
      </div>
    </div>
    <div class="card-title">
      <!-- 显示总金额 -->
      <div class="totalMoney">商品总价：￥{{totalMoney | moneyFilter}}</div>
      <div class="card-title-button">
        <van-button size="small" type="danger" @click="clearCart" plain>清空</van-button>
        <van-button size="small" type="primary" @click="finishCart" plain>结算</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Stepper } from "vant";
import { toMoney } from "@/filter/moneyFilter.js";
import { mapMutations } from "vuex";
import { Dialog } from "vant";
import request from "../../utils/request.js";
import url from "@/serviceAPI.config.js";

export default {
  data() {
    return {
      cartInfo: [], //购物车内的商品
      isEmpty: true, //购物车是否为空
      errImg: 'this.src="' + require("@/assets/images/errorimg.png") + '"' //错误图片
    };
  },
  computed: {
    totalMoney() {
      let allMoney = 0;
      this.cartInfo.forEach((item, index) => {
        allMoney += item.price * item.count;
      });
      localStorage.cartInfo = JSON.stringify(this.cartInfo);
      return allMoney;
    }
  },
  created() {
    this.getCartInfo();
  },
  methods: {
    ...mapMutations(["setCartInfo"]),
    //得到购物车商品信息
    async getCartInfo() {
      //获取当前用户名
      let userName = JSON.parse(localStorage.userInfo).username;

      //判断localStorage里是否有购物车数据
      if (localStorage.cartInfo) {
        //如果有数据，我们去除并赋值给cartInfo
        this.cartInfo = JSON.parse(localStorage.cartInfo);
        this.updateCartList();
      } else {
        if (localStorage.userInfo != null) {
          console.log("userName", userName);
          let res = await request({
            url: url.getUserCart,
            method: "get",
            params: { userName }
          });
          console.log("[获取用户购物车]", res);
          this.cartInfo = res.message.cartlist;
        }
      }
      console.log("myInfo:", this.cartInfo);
      this.setCartInfo(this.cartInfo);
      this.isEmpty = this.cartInfo.length > 0 ? false : true;
    },
    //清空购物车
    clearCart() {
      Dialog.confirm({
        message: "确定清空购物车吗？"
      })
        .then(() => {
          localStorage.removeItem("cartInfo");
          this.cartInfo = [];
          this.setCartInfo(this.cartInfo);
          this.updateCartList();
        })
        .catch(() => {});
    },
    //结算
    finishCart() {
      console.log("[结算]");
    },
    beforeClose({ name, position, instance }) {
      if (position == "right") {
        Dialog.confirm({
          message: "确定删除吗？"
        })
          .then(() => {
            this.cartInfo = this.cartInfo.filter((o, i) => i != name);
            this.updateCartList();
            console.log("[商品确认删除]");
            instance.close();
          })
          .catch(() => {
            console.log("[商品取消删除]");
            instance.close();
          });
      } else {
        instance.close();
      }
    },
    async updateCartList() {
      let cartInfo = this.cartInfo;
      let userName = JSON.parse(localStorage.userInfo).username;
      localStorage.cartInfo = JSON.stringify(cartInfo);

      let res = await request({
        url: url.updateUserCart,
        method: "post",
        data: { cartInfo, userName }
      });
      console.log("[更新数据]", cartInfo, res);
    }
  },
  components: { "van-stepper": Stepper },
  filters: {
    moneyFilter(money) {
      return toMoney(money);
    }
  }
};
</script>

<style scoped lang="less">
.card-title {
  height: 2rem;
  line-height: 2rem;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 5px;
  .card-title-button {
    float: right;
  }
}
.cart-list {
  background-color: #fff;
  height: calc(100vh - 50px - 56px - 2rem);
  overflow-y: auto;
  .van-button--square {
    width: 100%;
    height: 100%;
  }
}
.cartList-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 0.5rem;
  font-size: 0.85rem;
  border-bottom: 1px solid #e4e7ed;
}
.cartList-row-img {
  flex: 6;
}
.cartList-row-text {
  flex: 14;
  padding-left: 10px;
}
.cartList-row-text .cartList-control {
  padding-top: 10px;
}
.cartList-row-price {
  flex: 4;
  text-align: right;
}
.totalMoney {
  display: inline;
}
</style>