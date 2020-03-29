<template>
  <div>
    <div class="navbar-div">
      <van-nav-bar title="购物车"></van-nav-bar>
    </div>
    <!-- 显示购物车商品 -->
    <div class="cart-list" ref="cartList">
      <div v-if="cartInfo.length">
        <div v-for="(item,index) in cartInfo" :key="index">
          <van-swipe-cell :before-close="beforeClose" :name="index">
            <cartGoods
              @goods-count-change="goodsCountChange"
              :itemImage="item.image"
              :itemName="item.Name"
              :itemCount="item.count"
              :itemPrice="item.price"
              :itemIndex="index"
            ></cartGoods>
            <template slot="right">
              <van-button square type="danger" text="删除" />
            </template>
          </van-swipe-cell>
        </div>
      </div>
      <div class="no-cart" v-else>
        <img src="@/assets/images/noCart.jpg" alt />
        <p>购物车空空！赶紧去加购吧！</p>
        <van-button round type="info" icon="logistics" @click="goShopping">去逛逛</van-button>
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
import { toMoney } from "@/filter/moneyFilter.js";
import { mapMutations } from "vuex";
import { Dialog } from "vant";
import request from "@/utils/request.js";
import url from "@/serviceAPI.config.js";
import { Toast } from "vant";
import cartGoods from "@/components/component/cartGoods.vue";

export default {
  data() {
    return {
      cartInfo: [], //购物车内的商品
      isEmpty: true //购物车是否为空
    };
  },
  computed: {
    totalMoney() {
      let allMoney = 0;
      this.cartInfo.forEach((item, index) => {
        allMoney += item.price * item.count;
      });
      return allMoney;
    }
  },
  created() {
    if (this.$store.state.cart.userInfo.username.length) {
      this.getCartInfo();
    } else {
      this.$router.push("/login");
      Toast.fail({
        forbidClick: true,
        message: "请先登录！"
      });
    }
  },
  mounted() {
    let docH = document.documentElement.clientHeight;
    this.$refs.cartList.style.height = docH - 46 - 50 - 45 - 11 + "px";
  },
  methods: {
    ...mapMutations(["set_cartInfo"]),
    //得到购物车商品信息
    async getCartInfo() {
      if (typeof this.$store.state.cart.userInfo != "undefined") {
        //如果有数据，我们去除并赋值给cartInfo
        this.cartInfo = this.$store.state.cart.userInfo.cartList;
        console.log("myInfo:", this.cartInfo);
        this.updateCartList();
      }
      this.isEmpty = this.cartInfo.length > 0 ? false : true;
    },
    //清空购物车
    clearCart() {
      Dialog.confirm({
        message: "确定清空购物车吗？"
      })
        .then(() => {
          this.cartInfo = [];
          this.updateCartList();
        })
        .catch(() => {});
    },
    //结算
    finishCart() {
      if (this.$store.state.cart.userInfo.cartList.length) {
        Dialog.confirm({
          message: "确定要结算吗？"
        })
          .then(() => {
            console.log("[结算]");
            this.$router.push({
              path: "/finishCart",
              query: { cartData: this.$store.state.cart.userInfo.cartList }
            });
          })
          .catch(() => {});
      }else {
        Toast.fail('请先加购商品');
      }
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
    //更新购物车数据
    async updateCartList() {
      this.set_cartInfo(this.cartInfo);
      this.$store.dispatch("updateCartList");
      console.log("[更新数据]");
    },
    //前往购物
    goShopping() {
      this.$router.push("/categoryList");
    },
    //监听商品数量变化
    goodsCountChange(index, count) {
      this.cartInfo[index].count = count;
    }
  },
  filters: {
    moneyFilter(money) {
      return toMoney(money);
    }
  },
  components: { cartGoods }
};
</script>

<style scoped lang="less">
.card-title {
  height: 45px;
  line-height: 45px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 5px;
  .card-title-button {
    float: right;
  }
}
.cart-list {
  background-color: #fff;
  // height: calc(100vh - 50px - 56px - 2rem);
  overflow-y: auto;
  .van-button--square {
    width: 100%;
    height: 100%;
  }
  .no-cart {
    text-align: center;
    p {
      margin-bottom: 10px;
    }
  }
}

.totalMoney {
  display: inline;
}
</style>