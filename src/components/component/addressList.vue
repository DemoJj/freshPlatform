<template>
  <div>
    <van-address-list
      v-model="chosenAddressId"
      :list="addressList"
      :switchable="switchable ? switchable : false"
      @add="onAdd"
      @edit="onEdit"
      @select="onClick"
      default-tag-text="默认"
    />
    <div class="editAddressBox">
      <van-popup v-model="editAddressShow">
        <van-address-edit
          :area-list="areaList"
          :address-info="addressInfo"
          show-delete
          show-set-default
          :area-columns-placeholder="['请选择', '请选择', '请选择']"
          @save="onSave"
          @delete="onDelete"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import areaList from "@/assets/areaList.js";
import { mapMutations } from "vuex";

export default {
  props: ["userName", "switchable"],
  data() {
    return {
      chosenAddressId: 0,
      areaList, //地区地址数据
      addressList: [], //用户地址
      addressIndex: 0, //当前地址索引
      editAddressShow: false, //是否显示地址编辑框
      addressInfo: {} //地址编辑框值
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    ...mapMutations(["set_addressList"]),
    initData() {
      //改造地址
      let currentAddress = JSON.parse(
        JSON.stringify(this.$store.state.cart.userInfo.addressList)
      );
      currentAddress.forEach((o, index) => {
        o.id = index;
        //选中默认
        if (o.isDefault) {
          this.chosenAddressId = index;
        }
      });
      this.addressList = currentAddress;
    },
    onAdd() {
      // Toast("新增地址");
      this.addressInfo = {};
      this.addressIndex = this.addressList.length;
      this.editAddressShow = true;
    },
    onEdit(item, index) {
      window.event.cancelBubble = true;
      // Toast("编辑地址:" + index);
      this.addressInfo = item;
      this.addressIndex = index;
      this.editAddressShow = true;
    },
    onClick(item) {
      this.$emit("item-click", item);
    },
    onSave(content) {
      content.address =
        content.province +
        content.city +
        content.county +
        content.addressDetail;
      //若有默认，去除其他默认
      if (content.isDefault) {
        this.addressList.forEach(o => {
          o.isDefault = false;
        });
      }
      this.addressList[this.addressIndex] = content;
      console.log("[保存地址]", content);
      setTimeout(() => {
        this.editAddressShow = false;
        console.log("[保存信息:]", this.addressList, this.userName);
        this.updateUserAddress();
      }, 0);
    },
    onDelete() {
      this.addressList = this.addressList.filter(
        (o, index) => index != this.addressIndex
      );
      setTimeout(() => {
        this.editAddressShow = false;
        this.updateUserAddress();
      }, 0);
    },
    //更新用户地址
    updateUserAddress() {
      this.set_addressList(this.addressList);
      this.$store.dispatch("updateAddress");
    }
  }
};
</script>

<style lang="less" scoped>
.editAddressBox {
  .van-address-edit {
    width: 90vw;
  }
}
</style>