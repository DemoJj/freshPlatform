<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar title="用户注册" left-text="返回" left-arrow @click-left="goBack" />

    <div class="register-panel">
      <van-field
        v-model="username"
        label="用户名"
        right-icon="clear"
        placeholder="请输入用户名"
        :error-message='usernameErrorMsg'
        required
        @click-right-icon="username=''"
      />

      <van-field 
        v-model="password" 
        type="password" 
        label="密码" 
        placeholder="请输入密码" 
        required 
        :error-message='passwordErrorMsg'
      />

      <div class="register-button">
        <van-button
          type="primary"
          :loading="openLoading"
          size="large"
          @click="registerAction"
        >马上注册</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Notify } from "vant";
import axios from "axios";
import url from "@/serviceAPI.config.js";
export default {
  data() {
    return {
      username: "",
      password: "",
      openLoading: false, //是否开启用户的Loading
      usernameErrorMsg:'',//当用户名出现错误的时候
      passwordErrorMsg:'',//当密码出现错误的时候
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    registerAction(){
        this.checkForm() && this.axiosRegisterUser()
    },
    axiosRegisterUser() {
        //   if (this.username == "" || this.password == "") {
        //     //Toast.fail('请输入完整用户信息！')
        //     Notify({ type: "warning", message: "请输入用户名或密码！" });
        //     return;
        //   }
      axios({
        url: url.registerUser,
        method: "post",
        data: {
          username: this.username,
          password: this.password
        }
      })
        .then(response => {
          console.log("response", response);
          if (response.data.code == 200) {
            // Toast.success('注册成功')
            let second = 3;
            const toast = Toast.loading({duration: 0,forbidClick: true,message: `注册成功(${second}s)`});
            const timer = setInterval(() => {
              second--;
              if (second) {
                toast.message = `注册成功(${second}s)`;
              } else {
                clearInterval(timer);
                // 手动清除 Toast
                Toast.clear();
                this.$router.push("/");
              }
            }, 1000);
          } else {
            console.log(response.data.message);
            Toast.fail({forbidClick: true,message:"注册失败"});
          }
          console.log("code", response.data.code);
        })
        .catch(error => {
          Toast.fail({forbidClick: true,message:"注册失败"});
          console.log("error", error);
        });
    },
    checkForm(){
        let isOk = true
        if(this.username.length<5){
            this.usernameErrorMsg = '用户名不能小于5位'
            isOk = false
        }else {
            this.usernameErrorMsg = ''
        }
        if(this.password.length<6){
            this.passwordErrorMsg = '密码不能小于6位'
            isOk = false
        }else {
            this.passwordErrorMsg =''
        }
        return isOk
    }
  }
};
</script>

<style scoped>
.register-panel {
  width: 96%;
  border-radius: 5px;
  margin: 20px auto;
  padding-bottom: 50px;
}
.register-button {
  padding-top: 10px;
}
</style>