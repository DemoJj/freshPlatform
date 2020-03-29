<template>
  <div>
    <van-card
      v-for="(item,key) in shopdata"
      :key="key"
      :num="item.count"
      :title="item.Name"
      :thumb="item.image"
      centered
      lazy-load
    >
      <div slot="price">￥{{item.price | moneyFilter}}</div>
    </van-card>
  </div>
</template>

<script>
import { toMoney } from "@/filter/moneyFilter.js";

export default {
    props:['shopdata'],
  filters: {
    moneyFilter(money) {
      return toMoney(money);
    }
  },
};
</script>

<style lang="less" scoped>
.van-card {
  background-color: white;
  &:not(:first-child) {
    margin-top: 0;
  }
  .van-card__title {
    font-weight: 800;
    line-height: 40px;
    color: black;
    font-size: 0.8rem;
  }
  .van-card__price {
    color: red;
  }
}
</style>