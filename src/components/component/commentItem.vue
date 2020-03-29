<template>
  <div class="comment-item">
    <div class="item-left">
      <van-image
        round
        width="50px"
        height="50px"
        :src="typeof user != 'undefined' ?  commentItem.goodsImg :commentItem.userImg "
      />
    </div>
    <div class="item-right">
      <div class="item-right-top">
        <span>{{typeof user != 'undefined' ? commentItem.goodsName : commentItem.userName }}：</span>
      </div>
      <div class="item-right-level">
        <van-rate
          v-model="commentItem.level"
          allow-half
          void-icon="star"
          void-color="#eee"
          color="rgb(229, 1, 125)"
          readonly
        />
      </div>
      <div class="item-right-content">
        <p style="font-size: 14px;">评论内容：</p>
        <p style="text-indent:2em">{{commentItem.content}}</p>
        <p style="float:right;color: gray;font-size: 14px;">评论时间:{{commentItem.date | toDateFormat}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {dateFormat} from '@/filter/dateFilter.js'
export default {
  props: ["commentItem", "user"],
  filters:{
    toDateFormat(item){
     return dateFormat(item)
    }
  }
};
</script>

<style lang="less" scoped>
.comment-item {
  display: flex;
  margin: 15px;
  &:last-child {
    margin-bottom: 0px;
  }
  .item-left {
    margin-right: 10px;
    flex:1;
  }
  .item-right {
    flex:6;
    line-height: 25px;
    padding-bottom: 10px;
    border-bottom: 1px solid #c8c9cc;
    .item-right-top {
      color: #646566cc;
    }
    .item-right-content {
      padding: 5px;
      border: 1px dashed #c8c9cc;
      overflow: hidden;

    }
  }
}
</style>