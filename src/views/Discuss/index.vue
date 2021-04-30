<template>
  <div class="discuss-container">
    <div class="search">
      <el-input
              size="large"
              v-model="searchContent"
              placeholder="请输入搜索内容"
      ></el-input>
      <el-button type="primary" icon="el-icon-search" @click="search"></el-button>
    </div>
    <sendMZone/>
    <mzonePyq/>
  </div>
</template>

<script>
  import sendMZone from '@/components/sendMZone'
  import mzonePyq from '@/components/mzonePyq'

  export default {
    components: {
      sendMZone,
      mzonePyq
    },
    data() {
      return {
        searchContent: ''
      }
    },
    created() {
      this.searchContent = ''
    },
    methods: {
      search() {
        this.$eventBus.$emit('refreshDiscussListEvent', {searchContent: this.searchContent})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .discuss-container {
    margin: 30px auto;
    padding-bottom: 60px;
    width: 800px;

    .search {
      display: flex;
      margin: 0 0 10px;
    }
  }
</style>
