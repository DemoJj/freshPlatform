<template>
  <div class="searchbox">
    <van-nav-bar title="搜索" left-text="返回" left-arrow @click-left="goBack" />
    <van-search
      v-model="searchValue"
      @input="searchInput"
      shape="round"
      background="#e5017d"
      placeholder="请输入搜索关键词"
    />
    <div class="search-history" v-if="searchHistory.length">
      <van-tag
        closeable
        size="large"
        plain
        round
        v-for="(item,index) in searchHistory"
        @click="historyClick(item)"
        @close="historyClose(index)"
        :key="index"
      ><span>{{item}}</span></van-tag>
    </div>
    <div class="search-content" ref="searchContent">
      <ul @click="selectSlideTab">
        <li
          v-for="(item,index) in serachRes"
          :key="index"
          :listdata-index="index"
          v-html="keyHeightLight(item.NAME)"
        ></li>
      </ul>
    </div>
  </div>
</template>

<script>
import url from "@/serviceAPI.config.js";
import request from "@/utils/request.js";
export default {
  data() {
    return {
      searchValue: "", //搜索内容
      show: true,
      debounceTimeout: null, //防抖定时器
      valid: true, // 节流状态
      serachRes: [], //搜索结果
      searchHistory: [] //搜索记录
    };
  },
  created() {
    if (localStorage.searchHistory != null) {
      this.searchHistory = JSON.parse(localStorage.searchHistory);
    }
  },
  mounted() {
    let docH = document.documentElement.clientHeight;
    this.$refs.searchContent.style.height = docH - 46 - 54 + "px";
  },
  methods: {
    goBack() {
      this.$router.push('/Main');
    },
    //搜索商品请求
    async searchGoods(val) {
      if (val.length) {
        let res = await request({
          url: url.searchGoods,
          method: "post",
          data: { searchVal: val }
        });
        if (res.code == 200) {
          this.serachRes = res.message;
        }
        console.log("搜索请求返回", res);
      }
    },
    //关键字高亮
    keyHeightLight(val) {
      if (this.searchValue.length) {
        let newKey = `<i>${this.searchValue}</i>`;
        return val.replace(this.searchValue, newKey);
      } else {
        return val;
      }
    },
    //搜索输入事件
    searchInput(value) {
      // console.log("输入值", value);
      let searchFun = () => {
        this.searchGoods(value);
      };
      this.throttle(searchFun, 500);
    },
    //防抖
    debounce(fn, wait) {
      if (this.debounceTimeout !== null) {
        clearTimeout(this.debounceTimeout);
      }
      this.debounceTimeout = setTimeout(fn, wait);
    },
    //节流
    throttle(fn, delay) {
      if (!this.valid) {
        //休息时间 暂不接客
        return false;
      }
      // 工作时间，执行函数并且在间隔期内把状态位设为无效
      this.valid = false;
      setTimeout(() => {
        fn();
        this.valid = true;
      }, delay);
    },
    //li点击事件委托
    selectSlideTab(e) {
      let listDataIndex = e.target.getAttribute("listdata-index");
      if (listDataIndex != null) {
        this.searchHistory.push(this.searchValue);
        this.searchHistory = Array.from(new Set(this.searchHistory));
        localStorage.searchHistory = JSON.stringify(this.searchHistory);
        this.$router.push({
          name: "Goods",
          params: { goodsId: this.serachRes[listDataIndex].ID }
        });
      }
    },
    //历史记录点击
    historyClick(val) {
      this.searchValue = val;
      this.searchGoods(val);
    },
    //历史记录关闭
    historyClose(index) {
      this.searchHistory.splice(index, 1);
      localSet("searchHistory", this.searchHistory);
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

<style lang="less" scoped>
.searchbox {
  background-color: white;
}
.search-content {
  position: absolute;
  z-index: 999;
  background: white;
  width: 100%;
  ul {
    background-color: white;
    li {
      height: 2rem;
      line-height: 2rem;
      padding: 10px 0 10px 15px;
      border-bottom: 1px solid;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      /deep/i {
        color: red;
        font-style: normal;
      }
    }
  }
}

.search-history {
  padding: 10px;
  background-color: rgb(229, 1, 125);
  .van-tag {
    margin-right: 5px;
  }
}
</style>