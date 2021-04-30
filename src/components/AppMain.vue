<template>
  <div class="app-main">
    <Header :userInfo="userInfo"></Header>
    <router-view @getUserInfo="getUserInfo" :key="key"/>
    <Footer class="footContainer"></Footer>
  </div>
</template>

<script>
  import Header from "@/components/Header";
  import Footer from '@/components/Footer';

  export default {
    name: 'AppMain',
    components: {
      Header,
      Footer
    },
    data() {
      return {
        key: this.$route.path,
        userInfo: {}
      }
    },
    created() {
      this.$eventBus.$on('updateUserInfo', (e) => {
        this.userInfo = e.userInfo
      })
    },
    methods: {
      getUserInfo(data) {
        this.userInfo = data
      }
    }
  }
</script>

<style scoped>
</style>
