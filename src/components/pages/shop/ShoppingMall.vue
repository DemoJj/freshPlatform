<template>
  <div>
    <!--search bar layout-->
    <div class="search-bar">
      <van-row gutter="5">
        <van-search @focus="searchFocus" shape="round" background="#e5017d" placeholder="搜索商品" />
      </van-row>
    </div>
    <!-- swipwer area -->
    <div class="swiper-area">
      <van-swipe :autoplay="bannerAutoPlay">
        <van-swipe-item
          v-for="(banner,index) in bannerPicArray"
          :key="index"
          @click="goGoodsInfo(banner.goodsId)"
        >
          <img width="100%" v-lazy="banner.image" height="100%" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- type-bar -->
    <div class="type-bar">
      <div v-for="(cate,index) in category" :key="index" class="type-item" @click="typeClick(index,cate.mallCategoryId)">
        <img v-lazy="cate.image" width="90%" />
        <span>{{cate.mallCategoryName}}</span>
      </div>
    </div>

    <!-- ad banner area -->
    <div class="ad-banner">
      <img v-if="adBanner" v-lazy="adBanner.PICTURE_ADDRESS" width="100%" />
    </div>

    <!-- recommend goods area -->
    <div class="recommend-area">
      <div class="recommend-title">商品推荐</div>
      <div class="recommend-body"></div>
    </div>

    <!-- swiper -->
    <swiper :options="swiperOption">
      <swiper-slide v-for="(item,index) in recommendGoods" :key="index">
        <div class="recommend-item" @click="goGoodsInfo(item.goodsId)">
          <img v-lazy="item.image" width="80%" />
          <div>{{item.goodsName}}</div>
          <div>￥{{item.price | moneyFilter}}(￥{{item.mallPrice}})</div>
        </div>
      </swiper-slide>
    </swiper>

    <!-- floorComponent -->
    <floorComponent :floorData="floor1" :floorTitle="floorName.floor1"></floorComponent>
    <floorComponent :floorData="floor2" :floorTitle="floorName.floor2"></floorComponent>
    <floorComponent :floorData="floor3" :floorTitle="floorName.floor3"></floorComponent>

    <!-- Hot Area -->
    <div class="hot-area">
      <div class="hot-title">热卖商品</div>
      <div class="hot-goods">
        <!-- 这里需要一个list组件 -->
        <van-list>
          <van-row gutter="20">
            <van-col
              span="12"
              v-for="(item,index) in hotGoods"
              :key="index"
              class="hot-goodsItem"
              @click="goGoodsInfo(item.goodsId)"
            >
              <goods-info
                :goodsImage="item.image"
                :goodsName="item.name"
                :goodsPrice="item.price"
                :goodsId="item.goodsId"
              ></goods-info>
            </van-col>
          </van-row>
        </van-list>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import swiperDefault from "@/components/swiper/swiperDefault";
import floorComponent from "@/components/component/floorComponent";
import { toMoney } from "@/filter/moneyFilter.js";
import goodsInfo from "@/components/component/goodsInfoComponent";
import url from "@/serviceAPI.config.js";

export default {
  name: "ShoppingMall",
  data() {
    return {
      bannerAutoPlay:3000,
      swiperOption: {
        slidesPerview: "auto",
        slidesPerView: 2
      },
      locationIcon: require("@/assets/images/location.png"),
      bannerPicArray: [], //轮播图片
      category: [], //商品类别标签栏
      adBanner: "", //广告图片
      recommendGoods: [], //推荐商品
      floor1: [], //楼层1的数据
      floor2: [], //楼层2的数据
      floor3: [], //楼层3的数据
      floorName: {}, //楼层名称
      hotGoods: [], //热卖商品
    };
  },
  created() {
    axios({
      url: url.getShoppingMallInfo,
      method: "GET"
    })
      .then(response => {
        console.log(response);
        if (response.status == 200) {
          this.category = response.data.message[0].category;
          this.adBanner = response.data.message[0].advertesPicture;
          this.bannerPicArray = response.data.message[0].slides;
          this.recommendGoods = response.data.message[0].recommend;
          this.floor1 = response.data.message[0].floor1;
          this.floor2 = response.data.message[0].floor2;
          this.floor3 = response.data.message[0].floor3;
          this.floorName = response.data.message[0].floorName;
          this.hotGoods = response.data.message[0].hotGoods;
        }
      })
      .catch(error => {
        console.error(error);
      });
  },
  methods: {
    //定位按钮
    goCity() {
      this.$router.push({ name: "City" });
    },
    //商品路由跳转
    goGoodsInfo(id) {
      this.$router.push({ name: "Goods", params: { goodsId: id } });
    },
    //搜索框聚焦
    searchFocus(){
      this.$router.push('/searchBox');
    },
    //商品类别点击事件
    typeClick(index,id){
      this.$router.push({name:'CategoryList',params:{typeIndex:index,typeID:id}})
    }
  },
  components: {
    swiper,
    swiperSlide,
    swiperDefault,
    floorComponent,
    goodsInfo
  },
  filters: {
    moneyFilter(money) {
      return toMoney(money);
    }
  },
  beforeRouteLeave(to, from, next) {
    // console.log('[监听路由]',to.path,from.path)
    if (to.path == "/goods") {
      localStorage.goodsRouterFrom = from.path;
    }
    next();
  }
};
</script>
<style>
.search-bar {
  background-color: #e5017d;
  overflow: hidden;
}
.search-input {
  width: 100%;
  height: 1.3rem;
  border-top: 0px;
  border-left: 0px;
  border-right: 0px;
  border-bottom: 1px solid 1px !important ;
  background-color: #e5017d;
  color: #fff;
}
.location-icon {
  padding-top: 0.2rem;
  padding-left: 0.3rem;
}

.swiper-area {
  width: 100%;
  clear: both;
  height: 12rem;
}
.van-swipe {
  height: 100%;
}
.type-bar {
  background-color: #fff;
  margin-bottom: 0.3rem;
  margin-top: 0.4rem;
  border-radius: 0.3rem;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.type-bar .type-item {
  padding: 0.3rem;
  font-size: 12px;
  text-align: center;
  flex: 1;
}

.ad-banner {
  padding: 0.3rem;
  background-color: #fff;
}

.recommend-area {
  background-color: #fff;
  margin-top: 0.3rem;
}
.recommend-title {
  border-bottom: 1px solid #eee;
  font-size: 14px;
  padding: 0.3rem;
  color: #e5017d;
}
.recommend-body {
  border-bottom: 1px solid #eee;
}
.recommend-item {
  width: 99%;
  border-right: 1px solid #eee;
  font-size: 12px;
  text-align: center;
  background-color: #fff;
  height: 100%;
  /* padding-bottom: 10px; */
  padding: 10px 10px;
  box-sizing: border-box;
}
.recommend-item div:nth-of-type(1) {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.hot-area {
  text-align: center;
  font-size: 14px;
  line-height: 1.8rem;
  background-color: #fff;
  margin-top: 5px;
}
.hot-title {
  border-bottom: 1px solid #ddd;
}
.hot-goods .hot-goodsItem {
  border-bottom: 1px solid #ddd;
}
.hot-goods .hot-goodsItem:nth-of-type(2n) {
  border-left: 1px solid #ddd;
  padding-left: 9px !important;
}
</style>