<template>
  <div class="member-box">
    <div class="navbar-box">
      <van-nav-bar title="会员中心" />
    </div>
    <div class="content-box">
      <div class="content-head">
        <van-image round width="5rem" height="5rem" :src="userImg" />
        <h3>{{userName}}</h3>
        <!-- <van-tag mark type="warning">标签</van-tag> -->
        <div class="content-head-button">
          <van-row type="flex" justify="center">
            <van-col :span="8">
              <van-button round type="default" icon="edit" size="small" @click="setUserInfo">设置信息</van-button>
            </van-col>
            <van-col :span="8">
              <van-button round type="danger" icon="close" size="small" @click="logout">退出登录</van-button>
            </van-col>
          </van-row>
        </div>
      </div>
      <van-popup v-model="setInfoShow" @closed="infoShowClose">
        <div class="setInfo-box">
          <h3>用户信息设置</h3>
          <van-uploader
            :after-read="afterRead"
            v-model="userImgList"
            :deletable="true"
            :max-count="1"
            :before-read="beforeRead"
          />
          <!-- <van-field v-model="userNameForm" label="用户名" placeholder="请输入您的用户名" :label-width="60" /> -->
          <van-button plain type="primary" @click="saveInfo" :loading="!setInfoShow">保存设置</van-button>
        </div>
      </van-popup>
    </div>
    <div class="member-body">
      <van-cell is-link size="large" icon="balance-list-o" @click="showOrderDetail">订单详情</van-cell>
      <van-cell is-link size="large" icon="records" @click="showComments">评价记录</van-cell>
      <van-collapse accordion v-model="activeNames">
        <van-collapse-item title="收货地址" name="1" icon="logistics">
          <address-list :user-name='userName' ></address-list>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import addressList from "@/components/component/addressList.vue";
import axios from "axios";
import { Toast } from "vant";
import request from "@/utils/request.js";
import url from "@/serviceAPI.config.js";
import { mapMutations } from "vuex";


export default {
  data() {
    return {
      activeNames: ["1"],
      setInfoShow: false,
      userImg: "",
      userImgList: [],
      userName: "",
      userNameForm: "",
      qiniu: {
        // domain: "https://upload-z2.qiniup.com",
        domain: url.saveImg,
        qiniuaddr: url.qiniuaddr
      },
      imgFile: ""
    };
  },
  computed: {},
  mounted() {
    this.initUserInfo();
  },
  methods: {
    ...mapMutations(["init_state"]),
    
    //初始化用户数据
    initUserInfo() {
      let userInfo = this.$store.state.cart.userInfo;
      this.userName = userInfo.username;
      if(typeof userInfo.userimg != 'undefined'){
        // this.userImg = "http://" + this.qiniu.qiniuaddr + "/" + userInfo.userimg;  
        this.userImg = "http://" + this.qiniu.qiniuaddr + userInfo.userimg;  
      }else {
        // this.userImg = "http://" + this.qiniu.qiniuaddr + "/" + 'demojx_157916051127630.jpg';
        this.userImg = "http://" + this.qiniu.qiniuaddr + 'demojx_15846256823962.jpg';
      }
    },
    //设置用户信息按钮
    setUserInfo() {
      //设置图片
      if (this.userImgList.length) {
        this.userImgList = [];
        this.userImgList.push({ url: this.userImg });
      } else {
        this.userImgList.push({ url: this.userImg });
      }
      //设置用户名
      this.userNameForm = this.userName;
      setTimeout(() => {
        this.setInfoShow = true;
      }, 0);
    },
    //退出登录
    logout() {
      this.init_state();
      this.$router.push("/login");
    },
    //图片上传前校验
    beforeRead(file) {
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        Toast("请上传 jpg或png 格式图片");
        return false;
      }
      if (file.size / (1024 * 1024) >= 2) {
        Toast("请上传文件大小 小于2M 的图片");
        return false;
      }
      return true;
    },
    //图片上传
    afterRead(file) {
      this.imgFile = file;
      console.log(this.imgFile);
    },
    //保存用户信息
    async saveInfo() {
      if (this.imgFile) {
        let res = await this.upqiniu();
        let form = {
          username: this.userNameForm,
          userimg: res
        };
        console.log("[保存用户信息]", form);
        axios({
          url: url.setUserInfo,
          method: "post",
          data: form
        })
          .then(response => {
            console.log("[保存用户信息请求成功]", response);
            localStorage.userInfo = JSON.stringify(form);
          })
          .catch(err => {
            console.log("[保存用户信息请求错误]", err);
          });
      }
      setTimeout(() => {
        this.setInfoShow = false;
      }, 0);
    },
    //七牛云图片上传
    upqiniu() {
      let req = this.imgFile;
      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      let filetype = "";
      if (req.file.type === "image/png") {
        filetype = "png";
      } else {
        filetype = "jpg";
      }
      // 重命名要上传的文件
      const keyname =
        "demojx_" +
        new Date().getTime() +
        Math.floor(Math.random() * 100) +
        "." +
        filetype;
      return new Promise(async (resolve, reject) => {
        try {
          // 从后端获取上传凭证token
          let res = await request({
            url: url.getQiniuToken,
            method: "get"
          });
          const formdata = new FormData();
          formdata.append("file", req.file);
          formdata.append("token", res.qnToken);
          formdata.append("key", keyname);
          // 获取到凭证之后再将文件上传到七牛云空间
          axios.post(this.qiniu.domain, formdata, config).then(response => {
            console.log('[保存图片返回值]',response)
            console.log(
              "[保存图片]:",
              "http://" + this.qiniu.qiniuaddr + "/" + response.data.key
            );
            this.userImg =
              // "http://" + this.qiniu.qiniuaddr + "/" + response.data.key;
              "http://" + this.qiniu.qiniuaddr + response.data.key;
            resolve(response.data.key);
          });
        } catch (err) {
          reject();
        }
      });
    },
    //弹出层关闭
    infoShowClose() {
      this.imgFile = "";
    },
    //进去订单详情页
    showOrderDetail(){
      this.$router.push('/orderDetail')
    },
    //进入评论记录页
    showComments(){
      this.$router.push('/comments')
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (typeof vm.$store.state.cart.userInfo == 'undefined') {
        vm.$router.push("/");
      }
    });
  },
  components: { addressList }
};
</script>

<style scoped lang="less">
.member-box {
  height: 100vh;
  background: white;
  .content-box {
    background: linear-gradient(to bottom, #e5016a, #e501be);
    height: 30vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    .van-popup {
      border-radius: 15px;
    }
    .setInfo-box {
      // height: 300px;
      width: 280px;
      text-align: center;
      padding: 20px;
      box-sizing: border-box;
      h3 {
        padding-bottom: 10px;
        border-bottom: 1px solid;
        margin-bottom: 10px;
      }
      .van-field {
        border: 1px dashed;
        border-radius: 15px;
        box-shadow: 0px 4px 8px 0px #0000002e;
        margin-bottom: 20px;
      }
      .van-button {
        display: block;
        margin: 15px auto;
      }
    }
    .content-head {
      text-align: center;
      padding-top: 2vh;
      width: 100%;
      h3 {
        color: white;
        font-weight: 500;
        font-size: 16px;
      }
      .content-head-button {
        margin-top: 2vh;
      }
    }
  }
}
</style>