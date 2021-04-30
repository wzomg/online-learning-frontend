<template>
  <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
    <el-menu-item index="/home" @click="goPath('/home')"><i class="el-icon-school site_icon"/>在线学习网站
    </el-menu-item>
    <el-menu-item index="/note" @click="goPath('/note')">学习笔记</el-menu-item>
    <el-menu-item index="/discuss" @click="goPath('/discuss')">讨论区</el-menu-item>
    <el-menu-item index="/favorite" @click="goPath('/favorite')">收藏夹</el-menu-item>
    <el-menu-item v-if="uInfo && uInfo.type === 1" index="/course" @click="goPath('/course')">添加课程</el-menu-item>
    <el-menu-item class="menu-right" index="login" v-if="isLogin" @click="goPath('/login')">登录</el-menu-item>
    <el-menu-item class="menu-right" index="register" v-if="isLogin" @click="goPath('/register')">注册</el-menu-item>
    <el-menu-item class="menu-right" v-if="!isLogin" index="6">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <el-avatar :size="40" :src="uInfo && uInfo.avatar" @error="errorHandler">
            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
          </el-avatar>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="/profile" @click="goPath('/profile')">个人信息</el-dropdown-item>
          <el-dropdown-item command="/logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu-item>
  </el-menu>
</template>

<script>
  import {LinkTo} from "@/utils/baseUtil";
  import {get, remove} from 'js-cookie';

  export default {
    props: ["userInfo"],
    name: "Header",
    components: {},
    data() {
      return {
        activeIndex: "1",
        isLogin: true,
        uInfo: {},
      };
    },
    created() {
      this.activeIndex = this.$route.path
      const userInfoStr = localStorage.getItem('userInfo')
      if (userInfoStr !== '') {
        //若本地存放用户信息，则解析字符串
        this.uInfo = JSON.parse(userInfoStr)
      }
    },
    methods: {
      LinkTo,
      logout() {
        this.$http.logout().then(() => {
          remove('ticket')
          //清空本地消息
          localStorage.setItem('userInfo', '')
          //清空用户信息
          this.uInfo = {}
          this.$message({
            message: '退出成功',
            type: 'success'
          })
          LinkTo.call(this, '/login')
        })
      },
      handleCommand(path) {
        if (path === '/profile') {
          this.goPath(path)
        } else {
          this.logout()
        }
      },
      goPath(path) {
        const ticket = get('ticket')
        // 点击登录或注册就不用提示
        if (path !== '/login' && path !== '/register' && !ticket) {
          this.$message.error('请先登录哦')
        }
        this.$router.push({path, replace: true})
      },
      errorHandler() {
      }
    },
    watch: {
      $route(to, from) {
        this.activeIndex = to.path
        this.isLogin = !get('ticket')
      },
      userInfo(newVal) {
        //监听父组件传来的
        this.uInfo = newVal
      }
    },
    mounted() {
      this.isLogin = !get('ticket')
    },
  };

</script>

<style scoped lang="less">
  .menu-right {
    float: right;
    margin-right: 20px;
    border: none !important;
  }
</style>
