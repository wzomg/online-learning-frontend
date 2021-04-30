<template>
  <div class="custom-picture-view-com">
    <div class="picture-view-header">
      <span class="info">
        <i class="icon el-icon-picture"></i><span class="statstics secondary-font">一共有{{pictures.length}}张图片</span>
      </span>
      <span class="delete">
        <i class="icon close el-icon-close" @click="deleteAll" title="关闭"></i>
      </span>
    </div>
    <div class="picture-list">
      <div class="picture-item" v-for="(item, index) in pictures" :key="index">
        <i class="close el-icon-close" @click="deleteItem(index)"></i>
        <img class="img" :src="item" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      pictures: {
        type: Array
      },
    },
    methods: {
      deleteItem(index) {
        this.$emit('deleteItem', index)
      },
      deleteAll() {
        this.$emit('deleteAll')
      }
    },
  }
</script>

<style lang="scss">
  .custom-picture-view-com {
    .picture-view-header {
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;

      .icon {
        font-size: 20px;
        cursor: pointer;
      }

      .statstics {
        margin-left: 10px;
      }
    }

    .picture-list {
      overflow: hidden;

      .picture-item {
        position: relative;
        float: left;
        margin-right: 10px;

        .close {
          position: absolute;
          top: 0;
          right: 0;
          background-color: rgba(0, 0, 0, .2);
          color: #ffffff;
          cursor: pointer;
        }

        .img {
          width: 270px;
        }

        .img-cover {
          display: flex;
          position: absolute;
          background-color: rgba(0, 0, 0, .6);
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }
      }
    }
  }
</style>
