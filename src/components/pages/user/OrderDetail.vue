<template>
  <div>
    <van-nav-bar title="我的订单" left-arrow @click-left="onClickLeft" />
    <div v-if="finishFlag">
      <div class="order-list-main" v-if="orderList.length">
        <div class="order-list-main-item" v-for="(item,index) in orderList" :key="index">
          <div class="olm-item-top">
            <p>订单编号:{{item.orderId}}</p>
            <span>交易完成</span>
          </div>
          <div class="olm-item-content">
            <shopList :shopdata="item.orderGoods"></shopList>
          </div>
          <div class="olm-item-bottom">
            <div>
              <van-button @click="toCommentEdit(item)" :disabled="typeof item.isComment !='undefined' ? true:false" type="info" size="small" round>
                {{typeof item.isComment !='undefined' ? '已评价' : '评价'}}
              </van-button>
            </div>
            <div>
              <p>创建时间:{{item.createTime | dateFormat}}</p>
              <p>收货地址:{{item.orderAddress.address}}</p>
              <p>合计:￥{{item.orderTotalMoney | moneyFormat}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="no-order" v-else>
        <img src="@/assets/images/noOrder.jpg" alt />
        <p>您暂无订单！</p>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request.js";
import url from "@/serviceAPI.config.js";

import shopList from "@/components/component/shopList";
import { dateFormat } from "@/filter/dateFilter.js";

export default {
  data() {
    return {
      finishFlag: false, //数据请求是否完成标志
      orderList: [] //用户订单数据
    };
  },
  watch: {},
  mounted() {
    this.getUserOrderList();
  },
  methods: {
    //路由返回
    onClickLeft() {
      this.$router.push("/member");
    },
    //获取用户订单数据
    async getUserOrderList() {
      await request({
        url: url.getOrderList,
        method: "post",
        data: { userName: this.$store.state.cart.userInfo.username }
      })
        .then(res => {
          console.log("[获取订单数据]", res);
          this.orderList = res.message.reverse();
          this.finishFlag = true;
        })
        .catch(err => {
          console.log("[获取订单数据报错]", err);
        });
    },
    //去商品评价
    toCommentEdit(item){
      this.$router.push({name:'CommentEdit',params:item});
    }
  },
  filters: {
    dateFormat(val) {
      return dateFormat(val);
    },
    moneyFormat(val) {
      return (val / 100).toFixed(2);
    }
  },
  components: { shopList }
};
</script>

<style lang="less" scoped>
.order-list-main-item {
  padding: 10px;
  margin: 10px;
  background-color: white;
  border-radius: 10px;
  font-size: 14px;
  .olm-item-top {
    p {
      display: inline-block;
    }
    span {
      float: right;
      color: red;
    }
  }
  .olm-item-content {
    margin: 10px 0;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
  }
  .olm-item-bottom {
    overflow: hidden;
    position: relative;
    div {
      &:first-child {
        position: absolute;
        bottom: 0;
      }
      &:last-child {
        float: right;
        text-align: right;
      }
    }
  }
}

.no-order {
  margin: 10px;
  padding: 10px;
  overflow: hidden;
  text-align: center;
  background: white;
  border-radius: 10px;
  img {
    width: 100%;
  }
}
</style>