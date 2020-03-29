<template>
  <div class="cartList-row">
    <div class="cartList-row-img">
      <img :src="itemImage" width="100%" :onerror="errImg" />
    </div>
    <div class="cartList-row-text">
      <div class="cartList-goodsname">{{itemName}}</div>
      <div class="cartList-control">
        <van-stepper v-model="goodsCount" @change="countChange"></van-stepper>
      </div>
    </div>
    <div class="cartList-row-price">
      <div>￥{{itemPrice | moneyFilter}}</div>
      <div>x{{itemCount}}</div>
      <div class="allPrice">￥{{itemPrice*itemCount | moneyFilter}}</div>
    </div>
  </div>
</template>

<script>
import { toMoney } from "@/filter/moneyFilter.js";

export default {
  data() {
    return {
      goodsCount:this.itemCount,//商品数量
      errImg: 'this.src="' + require("@/assets/images/errorimg.png") + '"' //错误图片
    };
  },
  methods:{
    //商品数量改变
    countChange(){
      this.$emit('goods-count-change',this.itemIndex,this.goodsCount);
    }
  },
  filters: {
    moneyFilter(money) {
      return toMoney(money);
    }
  },
  props: ["itemImage", "itemName", "itemCount", "itemPrice", "itemIndex"]
};
</script>

<style lang="less" scoped>
.cartList-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 0.5rem;
  font-size: 0.85rem;
  border-bottom: 1px solid #e4e7ed;
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
}
</style>