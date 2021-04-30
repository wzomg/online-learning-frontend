<template>
  <div v-loading="isLoading"
       class="mzone-pyq-edit">
    <i class="close-box el-icon-close" @click="close"></i>
    <div class="header">
      <el-avatar :size="60" :src="authorInfo.avatar" @error="()=>true">
        <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
      </el-avatar>
      <div class="user-info">
        <div class="nickname">
          <span class="nickname-link">
            {{authorInfo.username}}
          </span>
        </div>
        <div class="time">
          <span>{{pyqInfo.gmtCreate | formatDateToZH}}</span>
        </div>
      </div>
    </div>
    <div class="body">
      <part-title text="内容"/>
      <div class="content">
        <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="pyqInfo.content">
        </el-input>
      </div>
      <part-title text="图片"/>
      <div class="pictures" v-if="pyqInfo.pictures.length">
        <picture-view :pictures="pyqInfo.pictures" @deleteItem="deletePictureItem"
                      @deleteAll="deletePictures"/>
      </div>
      <div>
        <el-alert v-if="!pyqInfo.pictures.length" title="未添加图片" type="info" center :closable="false"/>
      </div>
    </div>
    <div class="footer">
      <part-title text="操作"/>
      <div class="operation">
        <el-button type="success" size="medium" @click="modifyPyq">保存</el-button>
        <el-button type="danger" size="medium" @click="close">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import pictureView from '@/components/customPictureView'
  import partTitle from '@/components/partTitle'
  import {defaultPyqItem} from '@/common'
  import {formatDateToZH} from '@/utils'

  export default {
    props: ["pyqid"],
    data() {
      return {
        pyqInfo: defaultPyqItem,
        authorInfo: {},
        isLoading: false
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.user.userInfo
      },
    },
    methods: {
      getPyqInfo() {
        this.isLoading = true
        this.$http.getPostById(this.pyqid).then(res => {
          this.isLoading = false
          if (res.code === 200) {
            // console.log("编辑返回的数据为：", res.data)
            this.pyqInfo = res.data.pInfo
            this.authorInfo = res.data.uInfo
          }
        })
      },
      modifyPyq() {
        const {content, pictures} = this.pyqInfo
        if (!content.trim() && pictures.length === 0) {
          this.$message({
            message: '不能更新为空哦！',
            type: 'warning'
          })
          return
        }
        this.isLoading = true
        const params = {
          id: this.pyqid,
          content,
          pictures
        }
        this.$http.updatePost(params).then(res => {
          this.isLoading = false
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.$emit('modify', this.pyqid, {content, pictures})
            this.$emit('close')
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      deletePictureItem(index) {
        this.pyqInfo.pictures.splice(index, 1)
      },
      deletePictures() {
        this.pyqInfo.pictures = []
      },
      close() {
        this.$emit('close')
      }
    },
    filters: {
      formatDateToZH(val) {
        return formatDateToZH(val)
      }
    },
    components: {
      pictureView,
      partTitle
    },
    created() {
      this.getPyqInfo()
    },
  }
</script>

<style lang="scss">
  @import '@/styles/mixin.scss';

  .mzone-pyq-edit {
    @include boxCenter;
    background-color: #fff;
    width: 650px;
    max-height: 500px;
    overflow: auto;
    /*height: 374px;*/
    padding: 10px;

    &.mobile {
      width: 90%;
    }

    .close-box {
      float: right;
      font-size: 20px;
      cursor: pointer;
    }

    .header {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #C0C4CC;
      padding: 0 0 10px;
      position: relative;

      .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 10px;

        .nickname {
          .nickname-link {
            text-decoration: none;
            color: #222222;
          }
        }

        .time {
          margin-top: 10px;
          color: #86847f;
        }
      }
    }

    .body {
      padding-bottom: 10px;

      .content {
        margin-bottom: 8px;
        font-size: 18px;
      }

      .pictures {
        .picture-item {
          cursor: zoom-in;

          .img {
            width: 270px;
          }
        }
      }
    }

    .footer {
      .operation {
        float: right;
        padding-bottom: 8px;
      }
    }
  }
</style>

