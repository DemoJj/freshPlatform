<template>
  <div class="goodsInfo-div">
    <div class="navbar-div">
      <van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="topimage-div">
      <img :src="goodsInfo.IMAGE1" width="100%" :onerror="errorImg" />
    </div>

    <div class="goodsTitle-div">
      <div class="goods-name">{{goodsInfo.NAME}}</div>
      <div class="goods-price">价格：{{goodsInfo.PRESENT_PRICE | moneyFilter}} 元</div>
    </div>

    <div class="goods-content">
      <van-tabs swipeable @rendered="tabRendered">
        <van-tab title="商品详情">
          <div class="detail" v-html="goodsInfo.DETAIL"></div>
        </van-tab>
        <van-tab title="评价">
          <comment-item v-for="(item,index) in commentList" :key="index" :commentItem="item"></comment-item>
        </van-tab>
      </van-tabs>
    </div>

    <div class="goods-bottom">
      <div>
        <van-button size="large" type="primary" @click="addGoodsToCart">加入购物车</van-button>
      </div>
      <div>
        <van-button size="large" type="danger" @click="goBuy">直接购买</van-button>
      </div>
    </div>

    <!--弹出层-->

    <van-popup v-model="show" position="bottom" :style="{ height: '30%' }">
      <cartGoods
        :itemImage="goodsInfo.IMAGE1"
        :itemName="goodsInfo.NAME"
        :itemCount="goodsCount"
        :itemPrice="goodsInfo.PRESENT_PRICE"
        @goods-count-change="goodsCountChange"
      ></cartGoods>
      <van-button type="danger" round icon="certificate" @click="comfirmBuy">确认购买</van-button>
    </van-popup>
  </div>
</template>

<script>
import axios from "axios";
import url from "@/serviceAPI.config.js";
import request from "@/utils/request.js";

import { Toast } from "vant";
import { toMoney } from "@/filter/moneyFilter.js";
import { mapMutations } from "vuex";
import cartGoods from "@/components/component/cartGoods.vue";
import commentItem from "@/components/component/commentItem.vue";

export default {
  data() {
    return {
      show: false, //弹出层显示
      goodsId: this.$route.query.goodsId
        ? this.$route.query.goodsId
        : this.$route.params.goodsId,
      goodsInfo: {}, //商品详细数据
      errorImg: 'this.src="' + require("@/assets/images/errorimg.png") + '"', //错误图片
      goodsCount: 1,
      commentList: []
    };
  },
  created() {
    //this.goodsId = this.$route.query.goodsId
    console.log("商品id", this.goodsId, this.$route);
    this.getInfo();
  },
  methods: {
    ...mapMutations(["set_cartInfo"]),
    getInfo() {
      axios({
        url: url.getDetailGoodsInfo,
        method: "post",
        data: {
          goodsId: this.goodsId
        }
      })
        .then(response => {
          if (response.data.code == 200 && response.data.message) {
            this.goodsInfo = response.data.message;
          } else {
            Toast("服务器错误，数据取得失败!");
          }
          console.log(this.goodsInfo.IMAGE1);
        })
        .catch(error => {
          Toast("服务器错误，数据取得失败!");
          console.log(error);
        });
    },
    onClickLeft() {
      if (localStorage.goodsRouterFrom != null) {
        this.$router.push(localStorage.goodsRouterFrom);
      } else {
        this.$router.go(-1);
      }
    },
    addGoodsToCart() {
      //取出购物车内的商品数据
      let cartInfo = this.$store.state.cart.userInfo.cartList;
      //判断购物车内是否已经有这个商品
      //如果没有返回undefind，如果有返回第一个查到的数据
      let isHaveGoods = cartInfo.find(cart => cart.goodsId == this.goodsId);
      console.log(isHaveGoods);
      if (!isHaveGoods) {
        //没有则添加进去
        let newGoodsInfo = {
          goodsId: this.goodsInfo.ID,
          Name: this.goodsInfo.NAME,
          price: this.goodsInfo.PRESENT_PRICE,
          image: this.goodsInfo.IMAGE1,
          count: 1
        };
        cartInfo.push(newGoodsInfo); //添加到购物车
        this.set_cartInfo(cartInfo);
        this.$toast.success("添加成功");
      } else {
        isHaveGoods.count++;
        this.set_cartInfo(cartInfo);
        this.$toast.success("已有此商品");
      }
      this.$router.push({ name: "Cart" }); //跳转
    },
    //直接购买
    goBuy() {
      this.show = true;
    },
    //监听商品数量变化
    goodsCountChange(index, count) {
      this.goodsCount = count;
    },
    //确认购买
    comfirmBuy() {
      let goodsJson = [
        {
          Name: this.goodsInfo.NAME,
          count: this.goodsCount,
          goodsId: this.goodsId,
          image: this.goodsInfo.IMAGE1,
          price: this.goodsInfo.PRESENT_PRICE
        }
      ];
      this.$router.push({
        path: "/finishCart",
        query: { cartData: goodsJson, fromGoods: true }
      });
    },
    //标签内容首次渲染时触发
    tabRendered(name, title) {
      if (title == "评价") {
        this.getGoodsComments();
      }
    },
    //获得商品评论
    async getGoodsComments() {
      try {
        let res = await request({
          url: url.getGoodsComments,
          method: "get",
          params: { goodsId: this.goodsId }
        });
        console.log("商品查询评论返回", res);
        if (res.code == 200) {
          this.commentList = res.message.reverse();
        } else {
          this.$toast.fail("查询失败");
        }
      } catch (err) {}
    }
  },
  filters: {
    moneyFilter(money) {
      return toMoney(money);
    }
  },
  components: { cartGoods, "comment-item": commentItem }
};
</script>

<style lang="less">
.goodsInfo-div {
  background-color: white;
  img {
    display: block;
  }
  .van-popup {
    padding-top: 10px;
    box-sizing: border-box;
    .van-button {
      width: 50%;
      margin: 20px auto;
      display: block;
    }
  }
  .goods-content {
    .van-tabs__content {
      margin-bottom: 60px;
    }
  }
}
.goodsTitle-div {
  background-color: #fff;
  text-align: center;
}
.detail {
  margin-bottom: 60px;
}
.goods-bottom {
  position: fixed;
  bottom: 0px;
  left: 0px;
  background-color: #fff;
  width: 100%;

  display: flex;
  flex-direction: row;
  flex-flow: nowrap;
}
.goods-bottom > div {
  flex: 1;
  padding: 5px;
}
</style>