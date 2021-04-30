<template>
  <div class="home">
    <div class="learn-tree">
      <list @getSubject="getSubjectInfo"/>
    </div>
    <div class="learn-contain">
      <el-card class="box-card" :style="{background: currentSubject.link ? '#fff' : '#eff1f4'}">
        <div v-if="currentSubject.link" class="learn-box">
          <div class="title">课程简介</div>
          <el-card class="content">
            {{currentSubject.description}}
          </el-card>
        </div>
        <div v-if="currentSubject.link" class="btns">
          <el-button class="collect" round @click="changeCollection">收藏</el-button>
          <el-button round @click="goToLearn">去学习</el-button>
        </div>
        <img class="img" v-if="!currentSubject.link" src="@/assets/img/empty.png" alt="">
      </el-card>
    </div>
  </div>
</template>

<script>
  import list from '@/views/components/list'

  export default {
    name: 'Home',
    data() {
      return {
        currentSubject: {}
      }
    },
    components: {
      list
    },
    methods: {
      getSubjectInfo(data) {
        this.currentSubject = data
      },
      changeCollection() {
        this.$http.changeFavorite(this.currentSubject.id).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      goToLearn() {
        window.open(this.currentSubject.link, '_blank');
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixin.scss';
  .home {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1020px;
    height: 60vh;
  }

  .learn-tree {
    float: left;
    width: 200px;
    height: 100%;
  }
  .img{
    @include boxCenter;
  }

  .learn-contain {
    margin-left: 200px;
    height: 100%;
  }

  .box-card {
    position: relative;
  }

  .learn-box {
    margin: 20px auto 0;
    height: 60%;
    width: 68%;
  }

  .learn-box .title {
    font-size: 26px;
    margin-bottom: 36px;
  }

  .learn-box .content {
    height: 32vh;
  }

  .btns {
    position: absolute;
    left: 50%;
    bottom: 50px;
    transform: translate(-50%, -50%);
  }

  .collect {
    margin-right: 90px;
  }

  ::v-deep .box-card, ::v-deep .el-tree, .app-container {
    height: 100%;
    overflow: hidden;
  }

  ::v-deep .el-button.is-round {
    padding: 8px 23px;
    width: 87px;
  }
</style>
