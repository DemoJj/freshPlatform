<template>
  <div class="comment-box">
    <van-nav-bar title="评论记录" left-arrow @click-left="onClickLeft" />
    <div class="comment-content">
      <comment-item v-for="(item,index) in commentList" :key="index" :commentItem="item" :user=true></comment-item>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request.js";
import url from "@/serviceAPI.config.js";

import commentItem from "@/components/component/commentItem.vue";
export default {
  data() {
    return {
      commentList: []
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    //初始化数据
    async initData() {
      try {
        let res = await request({
          url: url.getUserComments,
          method: "get",
          params: { userName: this.$store.state.cart.userInfo.username }
        });
        console.log('用户查询评论返回',res)
        if(res.code == 200){
          this.commentList = res.message.reverse();
        }else {
          this.$toast.fail('查询失败')
        }
      } catch (err) {}
    },
    onClickLeft() {
      this.$router.push("/member");
    }
  },
  components: { "comment-item": commentItem }
};
</script>

<style lang="less" scoped>
.comment-box {
  min-height: 100vh;
  background: white;
}
</style>