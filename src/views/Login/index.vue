<template>
  <div class="register">
    <div class="box">
      <div class="title">登&nbsp;&nbsp;录</div>
      <el-form
              :model="form"
              status-icon
              :rules="rules"
              ref="form"
              label-position="right"
              label-width="80px"
              class="inputList"
      >
        <el-form-item label="账号" prop="userID" class="listItem">
          <el-input
                  size="large"
                  v-model="form.userUN"
                  placeholder="输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPW" class="listItem">
          <el-input
                  size="large"
                  v-model="form.userPW"
                  placeholder="请输入密码"
                  show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="userCC" class="listItem code">
          <div class="listItem_ccode">
            <el-input
                    size="large"
                    class="itemText_ccode"
                    v-model="form.userCC"
                    placeholder="请输入验证码"
                    @keyup.enter.native="loginCLick"
            ></el-input>
            <div class="imageItem">
              <img :src="kaptcha + '1'" alt="" @click="refreshKaptcha"/>
            </div>
          </div>
        </el-form-item>
        <div class="rememberme">
          <el-checkbox v-model="form.rememberme">记住我</el-checkbox>
        </div>
        <el-form-item>
          <div class="btnBox">
            <el-button class="btnItem" type="primary" @click="loginCLick"
            >立即登录
            </el-button
            >
            <el-button class="btnItem" type="primary" @click="forgetPWClick"
            >注&nbsp;&nbsp;&nbsp;&nbsp;册
            </el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {LinkTo} from "@/utils/baseUtil";

  export default {
    name: "",
    components: {},
    props: {},
    data() {
      let validateUN = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入账号"));
        } else if (String(value).trim() === "") {
          callback(new Error("请输入有效的账号"));
        } else {
          callback();
        }
      };
      let validatePW = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else {
          callback();
        }
      };
      let validateCC = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入验证码"));
        } else {
          callback();
        }
      };
      return {
        form: {
          userUN: "",
          userPW: "",
          userCC: "", //check code 验证码
          rememberme: false
        },
        rules: {
          userID: [{validator: validateUN, trigger: "blur"}],
          userPW: [{validator: validatePW, trigger: "blur"}],
          userCC: [{validator: validateCC, trigger: "blur"}],
        },
        kaptcha: "",
      };
    },
    watch: {},
    computed: {},
    methods: {
      forgetPWClick() {
        this.$router.push('/register')
      },
      // 点击立即登录，会开启验证，
      // 根据服务器返回的信息进行相应的提示以及初始化登录状态操作，
      // 包括向服务器请求该账号对应的id相关的信息
      loginCLick() {
        this.$refs.form.validate((valid) => {
          // 验证不通过，不向服务发送验证请求
          if (!valid) return false;
          let data = {
            username: this.form.userUN,
            password: this.form.userPW,
            code: this.form.userCC,
            rememberme: this.form.rememberme
          };
          this.$http.login(data).then((res) => {
            // console.log(res);
            if (res.code === 200) {
              localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
              //通知 AppMain 去更新用户信息，然后 header 栏自动会更新，因为 header 里加了 watch 监听 userInfo 属性
              this.$eventBus.$emit('updateUserInfo', {userInfo: res.data.userInfo})
              this.$message({
                message: "登录成功",
                type: "success",
                duration: 500
              });
              setTimeout(() => {
                this.LinkTo("/", "replace");
              }, 500);
            } else if (res.code === 2010) {
              // 验证码错误
              this.$message.error(res.msg)
            } else if (res.code === 2011) {
              // 其他错误信息
              this.$message.error(res.msg)
            }
          });
        });
      },
      // 公共跳转方法
      LinkTo,
      // 刷新验证码
      refreshKaptcha() {
        this.kaptcha = this.$store.state.baseURL + "/kaptcha?p=" + Math.random();
      },
    },
    created() {
      // 初始化验证码
      this.refreshKaptcha();
    },
    mounted() {
    },
  };
</script>

<style scoped lang="less">
  .register {
    width: 100%;
  }

  .box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    width: 400px;
    background: rgba(255, 255, 255, 0.8);
    list-style: none;
    flex-direction: column;
    align-items: center;
    border-radius: 20px;
    box-shadow: 0 0 2px 6px rgba(240, 238, 238, 0.4);
  }

  .title {
    font-size: 30px;
    color: var(--main-color);
    margin: 20px;
  }

  .inputList {
    width: 350px;
    padding: 0;
  }

  .box /deep/ .el-input__inner:focus {
    border-color: var(--main-color);
  }

  .listItem {
    margin-bottom: 25px;
  }

  .code {
    margin-bottom: 10px;
  }

  .rememberme {
    text-align: left;
    margin: 17px 0 7px 80px;
  }

  .listItem_ccode {
    display: flex;
  }

  .itemText_ccode {
    flex: 1;
  }

  .imageItem {
    flex: 1;
  }

  .imageItem img {
    float: right;
    cursor: pointer;
  }

  .btnBox {
    display: flex;
    justify-content: space-around;
    margin: 10px 0 20px -80px;
  }

  .btnBox .btnItem {
    background-color: var(--main-color);
    outline: none;
    border: none;
  }

  .btnBox .btnItem:hover {
    opacity: 0.8;
  }
</style>

<style>
</style>
