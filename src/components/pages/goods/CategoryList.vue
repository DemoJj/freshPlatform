<template>
  <div>
    <div class="navbar-div">
      <van-nav-bar title="商品类别" />
    </div>
    <div>
      <van-row>
        <van-col span="6">
          <div class="leftNav" ref="leftNav">
            <ul>
              <li
                @click="clickCategory(index,item.ID)"
                :class="{categoryActive:categoryIndex==index}"
                v-for="(item,index) in catagoryList"
                :key="index"
              >{{item.MALL_CATEGORY_NAME}}</li>
            </ul>
          </div>
        </van-col>
        <van-col span="18">
          <div class="rightNav">
            <van-tabs v-model="active" :ellipsis="false" swipeable @change="clickCategorySub">
              <van-tab v-for="(item,index) in categorySubList" :key="index">
                <div slot="title">{{item.MALL_SUB_NAME}}</div>
                <div slot="default">
                  <div>
                    <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
                      <van-list
                        v-model="loading"
                        :finished="finished"
                        @load="onLoad"
                        finished-text="我是有底线的"
                      >
                        <div
                          class="list-item"
                          @click="goGoodsInfo(item.ID)"
                          v-for="(item,index) in goodList"
                          :key="index"
                        >
                          <div class="list-item-img">
                            <img :src="item.IMAGE1" width="100%" :onerror="errorImg" />
                          </div>
                          <div class="list-item-text">
                            <div>{{item.NAME}}</div>
                            <div>￥{{item.ORI_PRICE | moneyFilter}}</div>
                          </div>
                        </div>
                      </van-list>
                    </van-pull-refresh>
                  </div>
                </div>
              </van-tab>
            </van-tabs>
          </div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "@/serviceAPI.config.js";
import { getCategory, getCategorySub, getGoodsList } from "@/api/categoryList";
import { resolve, async } from "q";
import { toMoney } from "@/filter/moneyFilter.js";
export default {
  name: "CategoryList",
  data() {
    return {
      page: 1, //商品列表的页数
      goodList: [], //商品信息
      categorySubId: "", //商品子类ID
      catagoryList: [], //大类信息
      categoryIndex: 0, //大类下标
      categorySubList: [], //子类信息
      active: 0, //子类选中下标
      loading: false, //上拉加载使用
      finished: false, //上拉加载是否没有数据了
      isRefresh: false, //下拉刷新
      errorImg: 'this.src="' + require("@/assets/images/errorimg.png") + '"', //错误图片
      routerFlag: false //路由进入标志
    };
  },
  created() {
    (async () => {
      try {
        await this.getCategory();
        if (!this.routerFlag) {
          await this.getCategorySub(this.catagoryList[0].ID);
          this.categorySubId = this.categorySubList[0].ID;
          await this.getGoodsList();
        }
      } catch (error) {}
    })();
  },
  mounted() {
    let winHeight = document.documentElement.clientHeight;
    this.$refs.leftNav.style.height = winHeight - 46 - 50 + "px";
    document.getElementsByClassName("van-tabs__content")[0].style.height =
      winHeight - 90 - 50 + "px";
  },
  methods: {
    //获取大类信息
    async getCategory() {
      try {
        const res = await getCategory();
        console.log(res);
        if (res.code == 200 && res.message) {
          this.catagoryList = res.message;
        } else {
          this.$toast("服务器错误，获取信息失败！");
        }
      } catch (error) {
        console.log(error);
        this.$toast("服务器错误,数据获得失败！");
      }
    },
    //获取小类信息
    async getCategorySub(categoryId) {
      try {
        const res = await getCategorySub(categoryId);
        console.log(res);
        if (res.code == 200 && res.message) {
          this.categorySubList = res.message;
          this.active = 0;
        } else {
          this.$toast("服务器错误，获取信息失败！");
        }
      } catch (error) {
        console.log(error);
        this.$toast("服务器错误,数据获得失败！");
      }
    },
    //获取子类商品信息
    async getGoodsList() {
      try {
        const res = await getGoodsList(this.categorySubId, this.page);
        if (res.code == 200 && res.message.length) {
          this.page++;
          this.goodList = this.goodList.concat(res.message);
        } else {
          this.finished = true;
        }
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
    //点击大类方法
    async clickCategory(index, categoryId) {
      this.loading = true;
      this.categoryIndex = index;

      try {
        await this.getCategorySub(categoryId);
        this.clickCategorySub(0);
      } catch (error) {}
    },
    //点击子类获取商品信息方法
    clickCategorySub(index) {
      this.categorySubId = this.categorySubList[index].ID;
      console.log("点击子类获取信息方法", this.categorySubId);
      this.goodList = [];
      this.finished = false;
      this.page = 1;
      this.onLoad();
    },
    //上拉加载
    onLoad() {
      setTimeout(() => {
        this.finished = false;
        console.log("子类id" + this.categorySubId);
        this.categorySubId = this.categorySubId
          ? this.categorySubId
          : this.categorySubList[0].ID;
        this.getGoodsList();
      }, 1000);
    },
    //下拉刷新
    onRefresh() {
      this.finished = true;
      setTimeout(() => {
        this.isRefresh = false;
        this.finished = false;
        this.goodList = [];
        this.page = 1;
        this.onLoad();
      }, 500);
    },
    //路由跳转
    goGoodsInfo(id) {
      this.$router.push({ name: "Goods", params: { goodsId: id } });
    }
  },
  filters: {
    moneyFilter(money) {
      return toMoney(money);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      // 进入页面后获取列表内容
      if (typeof to.params.typeIndex != "undefined") {
        vm.routerFlag = true;
        vm.clickCategory(to.params.typeIndex, to.params.typeID);
      }
    });
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
.leftNav {
  background: linear-gradient(to bottom, #ffd7ed, #e8e8e8);
}
.leftNav ul li {
  line-height: 2rem;
  border-bottom: 1px solid #e4e7ed;
  padding: 3px;
  font-size: 0.8rem;
  text-align: center;
}
.categoryActive {
  background-color: #fff;
}
.van-tab--active {
  color: #198e94;
}
.list-item {
  display: flex;
  flex-direction: row;
  font-size: 0.8rem;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
  padding: 5px;
}
.rightNav .van-tabs__content {
  overflow: scroll;
}
.list-item-img {
  flex: 8;
}
.list-item-text {
  flex: 16;
  margin-top: 10px;
  margin-left: 10px;
}
</style>