<template>
  <div>
    <!-- 顶部 -->
    <div>
      <van-nav-bar title="城市列表" left-text="返回" left-arrow @click-left="onClickLeft" />
    </div>
    <!-- 搜索 -->
    <div class="searchCity">
      <form action="/">
        <van-search background="#e8e8e8" placeholder="请输入搜索关键词" v-model="seachValue" />
      </form>
    </div>
    <!-- 当前城市 -->
    <div class="currentCity">
      <p>当前城市</p>
      <ul>
        <li>{{currentCity}}</li>
      </ul>
    </div>
    <!-- 热门城市 -->
    <div class="hotCity">
      <p>热门城市</p>
      <ul>
        <li v-for="(item,index) in hotCity" :key="'hotCity-'+index">{{item}}</li>
      </ul>
    </div>
    <!-- 字母列表 -->
    <div class="cityList">
      <van-index-bar highlight-color="#1989fa" sticky>
        <div v-for="(item,index) in cityListFilter" :key="index">
          <van-index-anchor :index="item.firstName" />
          <van-cell :title="items" v-for="(items,index) in item.cityList" :key="'info-'+index"/>
        </div>
      </van-index-bar>
    </div>
  </div>
</template>

<script>
import cityListFilter from "@/utils/pinyin.js";
export default {
  data() {
    return {
      seachValue: "",
      currentCity:'重庆',//当前城市
      hotCity:['北京','上海','杭州','重庆','成都','厦门'],//热门城市
      cityListFilter: cityListFilter,
      
    };
  },
  computed: {},
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    }
  },
  mounted() {
      
  }
};
</script>

<style>
.van-search__content {
  background-color: #fff;
}
.currentCity p {
  padding-left: 10px;
  padding-bottom: 10px;
}
.currentCity ul {
  background-color: #fff;
  padding: 10px;
}
.currentCity ul > li {
  border: 1px solid #969799;
  width: 25%;
  border-radius: 5px;
  text-align: center;
}

.hotCity p {
  padding: 10px;
}
.hotCity ul {
  display: flex;
  background-color: #fff;
  flex-wrap: wrap;
  justify-content: space-around;
  padding-bottom: 10px;
}
.hotCity ul > li {
  border: 1px solid #969799;
  flex: 0 0 25%;
  border-radius: 5px;
  text-align: center;
  margin-top: 10px;
}
</style>