<template>
  <div>
    <div class="main-div">
      <keep-alive include="CategoryList,ShoppingMall">
        <router-view />
      </keep-alive>
    </div>
    <van-tabbar v-model="active" @change="changeTabbar(active)">
      <van-tabbar-item icon="shop">首页</van-tabbar-item>
      <van-tabbar-item icon="records">商品分类</van-tabbar-item>
      <van-tabbar-item icon="cart" :info="shopCount">购物车</van-tabbar-item>
      <van-tabbar-item icon="contact">会员中心</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "Main",
  data() {
    return {
      active: 0,
    };
  },
  created() {
    this.changeTabbarActive();
  },
  watch: {
    $route(to, from) {
      // console.log(to.meta);
      this.active = to.meta.active;
    }
  },
  computed:{
      ...mapGetters(['shopCount'])
  },
  methods: {
    changeTabbar(active) {
      switch (active) {
        case 0:
          this.$router.push({ name: "ShoppingMall" });
          break;
        case 1:
          this.$router.push({ name: "CategoryList" });
          break;
        case 2:
          this.$router.push({ name: "Cart" });
          break;
        case 3:
          this.$router.push({ name: "Login" });
          break;
      }
    },
    changeTabbarActive() {
      let nowActive = this.$route.meta.active;
      this.active = nowActive;
    }
  }
};
</script>

<style scoped>
.main-div {
  margin-bottom: 50px;
}
</style>