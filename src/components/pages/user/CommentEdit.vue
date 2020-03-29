<template>
  <div class="comment-edit">
    <van-nav-bar title="商品评价" left-arrow @click-left="onClickLeft" />
    <div class="comment-edit-content">
      <div class="edit-content-item" v-for="(item,index) in commentList" :key="index">
        <div class="item-top">
          <div class="content-top-l">
            <van-image width="100px" height="100px" :src="item.goodsImg" />
          </div>
          <div class="content-top-r">
            <span>{{item.goodsName}}</span>
            <van-rate
              v-model="item.level"
              allow-half
              void-icon="star"
              void-color="#eee"
              color="rgb(229, 1, 125)"
            />
          </div>
        </div>
        <div class="item-content">
          <van-field
            v-model="item.content"
            rows="3"
            autosize
            label="评价内容"
            type="textarea"
            maxlength="40"
            placeholder="请输入评价内容(默认好评)"
            show-word-limit
          />
        </div>
      </div>
    </div>
    <div class="comment-edit-bottom">
      <van-button round block type="info" @click="submit">提交</van-button>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import url from "@/serviceAPI.config.js";
import { Toast } from "vant";

export default {
  data() {
    return {
      commentList: []
    };
  },
  mounted() {
    this.initComment();
  },
  methods: {
    initComment() {
      if (typeof this.$route.params.orderGoods != "undefined") {
        let orderGoods = this.$route.params.orderGoods;
        orderGoods.forEach(item => {
          let tempObj = {};
          tempObj.userName = this.$store.state.cart.userInfo.username;
          tempObj.userImg = this.$store.state.cart.userInfo.userimg;
          tempObj.goodsId = item.goodsId;
          tempObj.goodsName = item.Name;
          tempObj.goodsImg = item.image;
          tempObj.level = 5;
          tempObj.content = "";
          this.commentList.push(tempObj);
        });
      } else {
        this.$router.push("/orderDetail");
      }
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    //提交
    async submit() {
      let submitList = JSON.parse(JSON.stringify(this.commentList));
      submitList.forEach(item => {
        if (!item.content.length) item.content = "默认好评";
      });
      console.log("[提交评价内容]", submitList);
      try {
        Toast.loading({
          message: "加载中...",
          forbidClick: true
        });
        let res = await request({
          url: url.submitComments,
          method: "post",
          data: { commentList: submitList,orderId:this.$route.params.orderId }
        });
        if (res.code == 200) {
          Toast.success("订单提交成功");
          this.$router.push('/orderDetail');
        } else {
          Toast.error("订单提交失败");
        }
      } catch (err) {
        console.log(err);
      }
      // console.log("[提交评价返回]", res);
    }
  }
};
</script>

<style lang="less" scoped>
.comment-edit {
  padding-bottom: 20px;
  min-height: 100vh;
  background: white;
  box-sizing: border-box;
  .comment-edit-content {
    .edit-content-item {
      border-bottom: 1px dashed #c8c9cc;
      margin: 10px;
      &:last-child {
        border: 0;
      }
      .item-top {
        display: flex;
        .content-top-l {
          padding: 5px;
          margin: 0 20px;
        }
        .content-top-r {
          display: flex;
          flex-direction: column;
          line-height: 60px;
        }
      }
    }
  }
  .comment-edit-bottom {
    padding: 0 5rem;
  }
}
</style>