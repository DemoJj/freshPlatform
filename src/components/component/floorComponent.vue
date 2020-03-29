<template>
  <div>
    <!-- floor one area -->
    <div class="floor">
      <div class="floor-title">{{floorTitle}}</div>
      <div class="floor-anomaly">
        <div class="floor-one" style="flex:1" >
          <img :src="floorData0.image" width="100%" height="100%" @click="goGoodsInfo(floorData0.goodsId)"/>
        </div>
        <div style="flex:1">
          <div class="floor-two">
            <img :src="floorData1.image" width="100%" height="50%" @click="goGoodsInfo(floorData1.goodsId)"/>
            <img :src="floorData2.image" width="100%" height="50%" @click="goGoodsInfo(floorData2.goodsId)" />
          </div>
        </div>
      </div>
      <div class="floor-rule">
        <div v-for="(item,index) in (floorData||'').slice(3)" :key="index">
          <img :src="item.image" width="100%" @click="goGoodsInfo(item.goodsId)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["floorData", "floorTitle"],
  data() {
    return {
      floorData0: {},
      floorData1: {},
      floorData2: {}
    };
  },
  created() {
    //在这里写的话得不到数据，因为数据是延迟返回的，异步
  },
  methods: {
    //商品路由跳转
    goGoodsInfo(id) {
      this.$router.push({ name: "Goods", params: { goodsId: id } });
    }
  },
  watch: {
    //监听数据
    floorData: function(val) {
      console.log(this.floorData);
      this.floorData0 = this.floorData[0];
      this.floorData1 = this.floorData[1];
      this.floorData2 = this.floorData[2];
    }
  }
};
</script>

<style scoped>
.floor {
  margin-top: 0.3rem;
}
.floor-anomaly {
  overflow: hidden;
  display: flex;
  flex-direction: row;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  height: 10rem;
}
.floor-anomaly div {
  height: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
}
.floor-one {
  width: 33rem;
  border-right: 1px solid #ddd;
}
.floor-two {
  border-bottom: 1px solid #ddd;
}
.floor-two img:first-of-type {
  border-bottom: 1px solid #ddd;
}
.floor-rule {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #fff;
}
.floor-rule div {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 50%;
  border-bottom: 1px solid #ddd;
}
.floor-rule div:nth-child(odd) {
  border-right: 1px solid #ddd;
}
.floor-title {
  text-align: center;
  font-size: 14px;
  height: 1.8rem;
  line-height: 1.8rem;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
}
</style>