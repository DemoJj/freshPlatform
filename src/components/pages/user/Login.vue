<template>
  <div class="loginBox">
    <!-- 导航栏 -->
    <van-nav-bar left-arrow @click-left="goBack" />

    <div class="login-panel">
      <h3>登录 / 注册</h3>
      <van-field
        v-model="username"
        right-icon="clear"
        placeholder="USERNAME"
        left-icon="contact"
        :error-message="usernameErrorMsg"
        @click-right-icon="username='';password=''"
      />

      <van-field
        v-model="password"
        type="password"
        placeholder="PASSWORD"
        left-icon="warn-o"
        :error-message="passwordErrorMsg"
      />

      <div class="login-button">
        <van-button
          color="linear-gradient(to right, #4bb0ff, #6149f6)"
          :loading="openLoading"
          @click="loginAction"
        >登录</van-button>
        <van-button
          color="linear-gradient(to right, rgb(255, 75, 75), rgb(246, 73, 161))"
          :loading="openLoading"
          @click="registerAction"
        >注册</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import axios from "axios";
import url from "@/serviceAPI.config.js";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      username: "",
      password: "",
      openLoading: false, //是否开启用户的Loading
      usernameErrorMsg: "", //当用户名出现错误的时候
      passwordErrorMsg: "" //当密码出现错误的时候
    };
  },
  methods: {
    ...mapMutations(["set_userInfo"]),

    goBack() {
      if (this.$store.state.cart.userInfo.username == '') {
        this.$router.push("/");
      } else {
        this.$router.go(-1);
      }
    },
    loginAction() {
      this.checkForm() && this.axiosLoginUser();
    },
    axiosLoginUser() {
      axios({
        url: url.loginUser,
        method: "post",
        data: {
          username: this.username,
          password: this.password
        }
      })
        .then(response => {
          console.log("请求返回结果：", response);
          if (response.data.code == 200 && response.data.message) {
            if (response.data.message == "用户不存在") {
              Toast.fail({ forbidClick: true, message: "用户不存在" });
            } else {
              let second = 3;
              const toast = Toast.loading({
                duration: 0,
                forbidClick: true,
                message: `登录成功(${second}s)`
              });
              const timer = setInterval(() => {
                second--;
                if (second) {
                  toast.message = `登录成功(${second}s)`;
                } else {
                  clearInterval(timer);
                  // 手动清除 Toast
                  Toast.clear();
                  //记录登录状态
                  this.recordUserInfo(response);
                }
              }, 1000);
            }
          } else {
            Toast.fail({ forbidClick: true, message: "登录失败" });
          }
        })
        .catch(error => {
          console.log("请求报错:", error);
          Toast.fail({ forbidClick: true, message: "登录失败" });
        });
    },
    registerAction() {
      this.checkForm() && this.axiosRegisterUser();
    },
    axiosRegisterUser() {
      axios({
        url: url.registerUser,
        method: "post",
        data: {
          username: this.username,
          password: this.password
        }
      })
        .then(response => {
          if (response.data.code == 200) {
            let second = 3;
            const toast = Toast.loading({
              duration: 0,
              forbidClick: true,
              message: `注册成功(${second}s)`
            });
            const timer = setInterval(() => {
              second--;
              if (second) {
                toast.message = `注册成功(${second}s)`;
              } else {
                clearInterval(timer);
                // 手动清除 Toast
                Toast.clear();
                //记录登录状态
                this.recordUserInfo(response);
              }
            }, 1000);
          } else {
            console.log(response.data.message);
            if (response.data.message.code == 11000) {
              Toast.fail({ forbidClick: true, message: "该账号已被注册" });
            } else {
              Toast.fail({ forbidClick: true, message: "注册失败" });
            }
          }
          console.log("code", response.data.code);
        })
        .catch(error => {
          Toast.fail({ forbidClick: true, message: "注册失败" });
          console.log("error", error);
        });
    },
    checkForm() {
      let isOk = true;
      if (this.username.length < 5) {
        this.usernameErrorMsg = "用户名不能小于5位";
        isOk = false;
      } else {
        this.usernameErrorMsg = "";
      }
      if (this.password.length < 6) {
        this.passwordErrorMsg = "密码不能小于6位";
        isOk = false;
      } else {
        this.passwordErrorMsg = "";
      }
      return isOk;
    },
    //记录登录状态
    recordUserInfo(response) {
      new Promise((resolve, reject) => {
        this.set_userInfo(response.data.userInfo);

        localStorage.setItem("token", response.data.token);
        console.log("[登录信息]", response.data);
        
        setTimeout(() => {
          resolve();
        }, 500);
      })
        .then(() => {
          this.$router.push("/");
        })
        .catch(error => {
          Toast.fail({
            forbidClick: true,
            message: "登录状态报错失败"
          });
          console.log("登录状态保存失败报错:", error);
        });
    }
  },
  created() {
    if (this.$store.state.cart.userInfo.username.length) {
      this.$router.push("/member");
    }
  }
};
</script>

<style scoped>
.loginBox {
  background: url("~@/assets/images/login.jpg") no-repeat;
  background-size: 100% 100%;
  height: 100vh;
  overflow-y: hidden;
}
.van-nav-bar {
  background-color: transparent;
  inline-size: 0;
}
.login-panel {
  width: 82%;
  border-radius: 5px;
  margin: 15vh auto;
  padding: 10px 10px 50px;
  box-sizing: border-box;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4);
}
.login-panel h3 {
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
}
.login-button {
  text-align: center;
  margin-top: 40px;
  letter-spacing: 20px;
}
</style>