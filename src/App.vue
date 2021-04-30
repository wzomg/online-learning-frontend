<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  import Header from "@/components/Header";
  import Footer from '@/components/Footer'

  export default {
    name: 'App',
    components: {
      Header,
      Footer
    },
    created() {
      //console.log(this.$route.path)
    },
    data() {
      return {
        key: this.$route.path
      }
    }
  }

</script>
<style lang="less">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }

  .footContainer {
    position: fixed;
    bottom: 0
  }
</style>
