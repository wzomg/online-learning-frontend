<template>
  <div class="send-mzone-com">
    <div class="header">
      <div class="send-content">
        <textarea
                class="send-textarea"
                v-model="content"
                maxlength="200"
                placeholder="说点什么吧~"
                @focus="showFotter = true"
        ></textarea>
      </div>
    </div>
    <transition name="roll">
      <div class="footer" v-if="showFotter">
        <div class="poster-attach">
          <i class="item iconfont icon-emoji" @click.stop="handlerShowEmoji"></i>
          <el-upload
                  class="upload-demo"
                  ref="upload"
                  action="/api/post/imgUpload"
                  :on-success="handleSuccess"
                  :with-credentials="true"
                  accept="image/png, image/jpeg, image/gif, image/jpg"
                  :limit="1">
            <i class="item el-icon-picture"></i>
          </el-upload>
        </div>
        <div class="send">
          <el-button type="success" size="small" @click="send" :loading="isPublishing">发表</el-button>
          <el-button type="danger" size="small" @click="cancel">取消</el-button>
        </div>
        <transition name="roll">
          <div class="emoji-com" v-show="showEmoji">
            <custom-emoji @addemoji="addEmoji"/>
          </div>
        </transition>
      </div>
    </transition>
    <transition name="roll">
      <div class="picture-view-area" v-show="pictures.length">
        <picture-view :pictures="pictures" @deleteItem="deletePictureItem"
                      @deleteAll="deletePictures"/>
      </div>
    </transition>
  </div>
</template>

<script>
  import '@/static/iconfont/iconfont.css'
  import customEmoji from '@/components/customEmoji'
  import pictureView from '@/components/customPictureView'

  export default {
    components: {
      customEmoji,
      pictureView
    },
    data() {
      return {
        content: '',
        pictures: [],
        showFotter: false,
        showEmoji: false,
        showUploadImg: false,
        token: '',
        isPublishing: false
      }
    },
    methods: {
      async send() {
        if (!this.content) {
          this.$message.error('说点什么吧？')
          return
        }
        this.isPublishing = true
        const data = {
          content: this.content,
          pictures: this.pictures
        }
        this.$http.addPost(data).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.content = ""
            this.pictures = []
            this.showFotter = false
            this.isPublishing = false
            this.$eventBus.$emit('refreshDiscussListEvent', {searchContent: ''}) //触发更新讨论列表
          } else {
            this.$message.error(res.msg)
            this.isPublishing = false
          }
        })
      },
      handleSuccess(res) {
        //清空文件列表
        this.$refs.upload.clearFiles()
        this.$message({
          type: 'success',
          message: '上传成功'
        })
        this.pictures = [...this.pictures, res.data.imgUrl]
      },
      cancel() {
        this.showFotter = false
        this.content = ''
        this.pictures = []
      },
      deletePictureItem(index) {
        this.pictures.splice(index, 1)
      },
      deletePictures() {
        this.pictures = []
      },
      addEmoji(item) {
        this.content += item
      },
      handlerShowEmoji() {
        this.showEmoji = !this.showEmoji
        this.showUploadImg = false
      },
      documentHandlerClick() {
        this.showEmoji = false
        this.showUploadImg = false
      }
    },
    created() {
      document.addEventListener('click', this.documentHandlerClick)
    },
  }
</script>

<style lang="scss">
  @import '@/styles/animation.scss';

  .send-mzone-com {
    position: relative;
    background-color: #fff;
    margin-bottom: 10px;

    .header {
      display: flex;
      border-bottom: 1px solid #C0C4CC;
      align-items: center;
      height: 60px;

      .send-content {
        flex-grow: 1;
        height: 100%;

        .send-textarea {
          display: inline-block;
          height: 100%;
          box-sizing: border-box;
          width: 100%;
          outline: none;
          border: none;
          padding: 10px;
          resize: none;
        }
      }
    }

    .footer {
      position: relative;
      padding: 7px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all .5s ease;

      .poster-attach {
        display: flex;
        line-height: 21px;

        .item {
          cursor: pointer;
          margin-right: 10px;
          font-size: 20px;
          color: #c35673;
        }

        .emoji-item {
          text-align: top;
        }
      }
    }

    .picture-view-area {
      padding: 10px;
    }

    .emoji-com {
      width: 100px;
      position: absolute;
      top: 100%;
      z-index: 1002;
    }
  }
</style>

