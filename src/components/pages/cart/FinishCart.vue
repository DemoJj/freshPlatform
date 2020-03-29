<template>
  <div>
    <!-- 联系人卡片 -->
    <div class="finish-cart-top">
      <van-nav-bar left-arrow @click-left="goBack" title="订单结算" />
      <van-cell
        :icon="cardType"
        center
        :title="addressTitle"
        is-link
        :label="addressLabel"
        @click="setAddressShow=true"
      />
      <van-overlay :show="setAddressShow" @click="setAddressShow = false">
        <div @click.stop>
          <div class="setAddress-box">
            <address-list @item-click="itemClick" :switchable="true"></address-list>
          </div>
        </div>
      </van-overlay>
    </div>
    <!-- 商品详细 -->
    <div class="finish-cart-content">
      <shopList :shopdata="cartData"></shopList>
    </div>
    <!-- 提交订单 -->
    <div class="finish-cart-bottom">
      <van-submit-bar :price="totalMoney" button-text="提交订单" @submit="onSubmit" />
      <van-overlay :show="submitShow" @click="submitShow = false">
        <div class="wrapper" @click.stop>
          <div>
            <van-picker
              show-toolbar
              title="选择支付方式"
              :columns="columns"
              @cancel="onCancel"
              @confirm="onConfirm"
            />
          </div>
        </div>
      </van-overlay>
    </div>
  </div>
</template>

<script>
import addressList from "@/components/component/addressList.vue";
import shopList from "@/components/component/shopList.vue";
import { Toast } from "vant";
import request from "@/utils/request.js";
import url from "@/serviceAPI.config.js";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      setAddressShow: false,
      submitShow: false,
      columns: ["微信", "支付宝"],
      currentContact: {}, //当前地址数据
      cartData: [], //购物车数据
      routerFrom:'',//路由入口
    };
  },
  created() {
    if (!this.$store.state.cart.userInfo.username.length) {
      this.$router.push("/login");
      Toast.fail({
        forbidClick: true,
        message: "请先登录！"
      });
    }
  },
  mounted() {
    this.initAddressData();
    this.initCartData();
  },
  methods: {
    ...mapMutations(["set_cartInfo"]),
    //初始化地址数据
    initAddressData() {
      let addressList = this.$store.state.cart.userInfo.addressList;
      let currentContact = {};
      addressList.forEach(o => {
        if (o.isDefault) {
          currentContact = o;
        }
      });
      if (!Object.keys(currentContact).length) {
        if (addressList.length) {
          currentContact = addressList[0];
        }
      }
      this.currentContact = currentContact;
    },
    //初始化购物车数据
    initCartData() {
      console.log("路由传值", this.$route.query.cartData);
      // this.cartData = this.$store.state.cart.userInfo.cartList;
      this.cartData = this.$route.query.cartData;
    },
    goBack() {
      if (typeof this.$route.query.fromGoods != "undefined") {
        this.$router.push({
          name: "Goods",
          params: { goodsId: this.cartData[0].goodsId }
        });
      } else {
        this.$router.go(-1);
      }
    },
    itemClick(item) {
      this.currentContact = item;
      setTimeout(() => {
        this.setAddressShow = false;
      }, 0);
    },
    //提交
    onSubmit() {
      console.log("提交");
      this.submitShow = true;
    },
    //支付方式确认
    onConfirm(value, index) {
      Toast.loading({
        duration: 0,
        message: "支付中...",
        forbidClick: true,
        loadingType: "spinner"
      });
      setTimeout(async () => {
        Toast.clear();
        let userName = this.$store.state.cart.userInfo.username;
        let orderGoods = this.cartData;
        let orderTotalMoney = this.totalMoney;
        let orderAddress = this.currentContact;
        let payType = value;
        let orderform = {
          userName,
          orderGoods,
          orderTotalMoney,
          orderAddress,
          payType
        };
        console.log("[订单数据]", orderform);
        await request({
          url: url.submitOrder,
          method: "post",
          data: orderform
        }).then(res => {
          console.log("[订单请求成功]", res);
          Toast.success("订单提交成功");
          if(this.routerFrom == '/cart'){
            //清空购物车
            this.set_cartInfo([]);
            this.$store.dispatch("updateCartList");
          }
          this.$router.push("/orderDetail");
        });
      }, 3000);
    },
    //支付方式取消
    onCancel() {
      this.submitShow = false;
    }
  },
  computed: {
    //合计总额
    totalMoney() {
      let allMoney = 0;
      this.cartData.forEach((item, index) => {
        allMoney += item.price * item.count;
      });
      return allMoney * 100;
    },
    //地址卡片类型
    cardType() {
      return Object.keys(this.currentContact).length ? "user-o" : "add-o";
    },
    //地址收货人
    addressTitle() {
      if (Object.keys(this.currentContact).length) {
        return `收货人：${this.currentContact.name} (${this.currentContact.tel})`;
      } else {
        return "添加收货人";
      }
    },
    //地址收货地址
    addressLabel() {
      if (Object.keys(this.currentContact).length) {
        return `收货地址：${this.currentContact.address}`;
      } else {
        return "";
      }
    }
  },
  components: { addressList, shopList },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // console.log("[路由监听]", to.path, from.path);
      vm.routerFrom = from.path;
    });
  }
};
</script>

<style lang="less" scoped>
.finish-cart-top {
  .van-cell {
    height: 65px;
    &:before {
      content: "";
      background: repeating-linear-gradient(
        -45deg,
        #ff6c6c 0,
        #ff6c6c 20%,
        transparent 0,
        transparent 25%,
        #1989fa 0,
        #1989fa 45%,
        transparent 0,
        transparent 50%
      );
      background-size: 80px;
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 2px;
    }
  }
}
.finish-cart-content {
  max-height: calc(100vh - 46px - 65px - 50px);
  overflow-y: auto;
}

.finish-cart-bottom {
  .van-submit-bar {
    z-index: 0;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .van-picker {
      width: 80vw;
    }
  }
}
</style>