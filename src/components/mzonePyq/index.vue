<template>
  <div class="pyq-com">
    <div class="pyq-com-wrapper">
      <div class="item" v-for="(item, pyqIndex) in pyqList" :key="item.id">
        <div class="header">
          <el-avatar :size="60" :src="item.uInfo.avatar" @error="()=>true">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
          </el-avatar>
          <div class="info">
            <div class="nickname">
              <el-popover
                      placement="top"
                      width="240"
                      trigger="hover">
                <user-card :user-details="item.uInfo"/>
                <span slot="reference" class="nickname-link">
                    {{item.uInfo.username}}
                </span>
              </el-popover>
            </div>
            <div class="time secondary-font">
              <span>{{item.gmtCreate | formatDateToZH}}</span>
            </div>
          </div>
          <div class="pyq-item-operation" v-if="item.uInfo.id === userInfo.id">
            <i class="el-icon-more" @click.stop="handleClickOperation(item.id)"></i>
            <div class="operation-list" v-if="showOperationListObj[item.id]">
              <span class="operation-list-item operation-text" @click="deleteItemPyq(item.id)">
                <i class="el-icon-delete-solid item-icon"/>删除
              </span>

              <span class="operation-list-item operation-text" @click="editPyq(item.id)">
                <i class="el-icon-edit-outline item-icon"/>编辑
              </span>
            </div>
          </div>
        </div>
        <div class="body">
          <div class="content">
            <span>{{item.content}}</span>
          </div>
          <div class="pictures">
            <span class="picture-item" v-for="(imgItem, index) in item.pictures" :key="index"
                  @click.stop="setCurrentImgUrl(imgItem)">
              <img class="img" :src="imgItem" alt="">
            </span>
          </div>
        </div>
        <div class="info">
          <div class="operation">
            <el-tooltip class="item" effect="dark" :content="commentTips" placement="top">
              <i
                      class="item iconfont icon-pinglun1 comment" title="评论"
                      @click="handleClickComment(item.id)"/>
            </el-tooltip>
            <i
                    class="item iconfont icon-dianzan like" title="点赞"
                    @click="doLike(item.id, pyqIndex)"
                    :style="(hasILike[item.id] || []).includes(userInfo.id) ? 'color: #c35673' : ''"/>
          </div>
        </div>
        <div class="comment-like">
          <div class="like iconfont icon-dianzan" v-if="item.likeList.length > 0">
            <span v-for="(likeitem, index) in item.likeList" :key="likeitem.id">
              <el-popover
                      placement="top"
                      width="240"
                      trigger="hover">
                <user-card :user-details="likeitem.authorInfo"/>
                <span slot="reference" class="nickname-link">
                    {{likeitem.authorInfo.username}}
                </span>
              </el-popover>
            </span>
          </div>
          <div class="comments">
            <comment-list @addchild="addChildComment" :pyqid="item.id" :commentlist="item.commentList"/>
          </div>
        </div>
        <div class="comment-area">
          <el-input placeholder="说点什么吧~" v-model="commentsObj[item.id]" :ref="'commentInp'+item.id"/>
          <i
                  class="iconfont icon-emoji"
                  style="margin: 0 10px; font-size: 20px; cursor: pointer;"
                  @click.stop="handlerShowEmoji($event, item.id)"
                  title="添加表情"
          />
          <el-button type="success" size="mini" @click="doComment(item.id, pyqIndex)">评论</el-button>
        </div>
      </div>
      <div class="loading">
        <el-button v-if="isLoading" type="info" style="width: 100%" :loading="isLoading">加载中</el-button>
      </div>
      <div style="margin-bottom: 10px">
        <el-alert v-if="!hasMore && !isLoading && pyqList.length" title="没有更多了..." type="info" center show-icon
                  :closable="false"/>
      </div>
      <transition name="roll">
        <div ref="emojiCom" class="emoji-com" v-if="showEmojiCom" :style="`left:${emojiLeft}; top: ${emojiTop}`"
             @mouseenter="handleEmojiMouseenter">
          <custom-emoji @addemoji="addEmoji" tabposition="top"/>
        </div>
      </transition>
    </div>
    <div class="no-data" v-if="!pyqList.length && !isLoading">
      <empty-svg width="200" height="200"/>
    </div>
    <transition>
      <picture-preview :show-oper="false" :current-img="currentImgUrl"
                       @setshow="setShowPicturePreview"
                       v-if="showPicturePreview"/>
    </transition>
    <div class="pyq-edit-box" v-if="showEditPyq">
      <pyq-edit :pyqid="currentEditPyqId" @close="closeEditPyq" @modify="modifyPyqItem"/>
    </div>
    <a style="color: #67b2e9;font-size: 13px;cursor: pointer" v-if="hasMore && !isLoading"  @click="getMoreData">加载更多...</a>
  </div>
</template>

<script>
  import '@/static/iconfont/iconfont.css'
  import picturePreview from '@/components/picturePreview'
  import customEmoji from '@/components/customEmoji'
  import commentList from '@/components/customCommentList'
  import pyqEdit from '@/components/mzonePyqEdit'
  import {debounce, formatDateToZH} from '@/utils'
  import {commentTips} from '@/common'
  import EmptySvg from '@/components/SVGComponents/empty'
  import userCard from '@/components/userCard'

  export default {
    data() {
      return {
        pyqList: [],
        pageIndex: 1,
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        hasMore: true,
        isLoading: false,
        currentImgUrl: '',
        showPicturePreview: false,
        commentsObj: {}, // 每条朋友圈的评论，key是帖子id,value是该朋友圈的评论
        showEmojiCom: false,
        currentPyq: '', // 当前选择的帖子
        emojiTop: '', // emoji组件的位置
        emojiLeft: '',
        showOperationListObj: {}, // 是否显示对本条朋友圈的操作列表
        commentTips,
        showEditPyq: false,
        currentEditPyqId: '', //当前编辑的帖子id
        searchContent: ''
      }
    },
    created() {
      this.getAllPost()
      this.$eventBus.$on('refreshDiscussListEvent', (e) => {
        // console.log(e)
        this.searchContent = e.searchContent
        this.pyqList = [] //置空
        this.hasMore = true
        this.getAllPost(e.searchContent)
      })
    },
    computed: {
      hasILike() { // 判断我也没有点赞
        const pyqLikeUserIdsMap = {}
        this.pyqList.forEach(item => {
          const ids = (item.likeList || []).map(item => item.authorInfo.id)
          pyqLikeUserIdsMap[item.id] = ids
        })
        return pyqLikeUserIdsMap
      }
    },
    methods: {
      getMoreData() {
        this.pageIndex++
        this.getAllPost(this.searchContent, true)
      },
      getAllPost(content, flag) {
        this.isLoading = true
        const param = {
          pageIndex: flag ? this.pageIndex : 1,
          searchContent: content ? content : ''
        }
        //发表帖子成功后要通知更新帖子列表
        this.$http.getPageOfPost(param).then(res => {
          if (res.code === 200) {
            if (res.data.postList.length > 0) {
              this.pyqList.push(...res.data.postList)
            } else {
              this.hasMore = false
            }
            // console.log("返回的评论数据为：", this.pyqList)
          }
          this.isLoading = false
        })
      },
      deleteItemPyq(id) {
        this.$confirm('删除后不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delPost(id).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.pyqList = this.pyqList.filter(item => item.id !== id)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleClickOperation(id) {
        if (!this.showOperationListObj[id]) {
          this.$set(this.showOperationListObj, id, true)
        } else {
          this.showOperationListObj[id] = !this.showOperationListObj[id]
        }
      },
      setCurrentImgUrl(url) {
        this.currentImgUrl = url
        this.showPicturePreview = true //设置预览图片
      },
      setShowPicturePreview(flag) {
        this.showPicturePreview = flag
      },
      doLike: debounce(function (pyqId, index) {
        this.$http.changeLove(pyqId).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            const tmp = JSON.parse(JSON.stringify(this.pyqList))
            if (res.data.resLove && res.data.resLove.id) {
              tmp[index].likeList.push({
                ...res.data.resLove,
                authorInfo: {
                  username: this.userInfo.username,
                  id: this.userInfo.id,
                  avatar: this.userInfo.avatar
                }
              })
            } else {
              tmp[index].likeList = tmp[index].likeList.filter(item => item.authorInfo.id !== this.userInfo.id)
            }
            this.pyqList = tmp
          } else {
            this.$message.error(res.msg)
          }
        })
      }, 500),
      doComment(id, index) {
        if (!this.commentsObj[id]) { //评论内容不为空
          return
        }
        const params = {
          postId: id,
          content: this.commentsObj[id],
          uid: this.userInfo.id
        }
        //console.log("朋友圈发表评论参数：", params)
        this.$http.addComment(params).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            const tmp = JSON.parse(JSON.stringify(this.pyqList))
            tmp[index].commentList.push({
              ...res.data.comment,
              authorInfo: {
                id: this.userInfo.id,
                username: this.userInfo.username,
                avatar: this.userInfo.avatar
              },
              replyList: []
            })
            this.pyqList = tmp
          } else {
            this.$message.error(res.msg)
          }
          this.commentsObj[id] = ''
        })
      },
      addEmoji(val) {
        this.commentsObj[this.currentPyq] += val
      },
      handlerShowEmoji(e, id) {
        this.currentPyq = id
        this.emojiTop = e.clientY + 40 + 'px'
        this.emojiLeft = e.clientX - 200 + 'px'
        this.showEmojiCom = true
      },
      handleDocmentClick() {
        this.showEmojiCom = false
        for (const key in this.showOperationListObj) {
          if (this.showOperationListObj.hasOwnProperty(key)) {
            this.showOperationListObj[key] = false
          }
        }
      },
      handleClickComment(id) {
        const key = 'commentInp' + id
        this.$refs[key][0].focus()
      },
      handleEmojiMouseenter() {
        this.$refs['emojiCom'] && this.$refs['emojiCom'].addEventListener('mouseleave', () => {
          this.showEmojiCom = false
        })
      },
      addChildComment(pyqId, id, data) { // pyqId:帖子Id，id：父评论id，data：新子评论
        const newPyq = JSON.parse(JSON.stringify(this.pyqList))
        const pyqIndex = this.pyqList.findIndex(pyqItem => pyqItem.id === pyqId)
        const commentIndex = this.pyqList[pyqIndex].commentList.findIndex(item => item.id === id)
        newPyq[pyqIndex].commentList[commentIndex].replyList.push(data)
        this.pyqList = newPyq
      },
      editPyq(id) {
        this.currentEditPyqId = id
        this.showEditPyq = !this.showEditPyq
      },
      closeEditPyq() {
        this.showEditPyq = false
      },
      modifyPyqItem(id, data) {
        const newPyqList = JSON.parse(JSON.stringify(this.pyqList))
        newPyqList.forEach(item => {
          if (item.id === id) {
            item.content = data.content
            item.pictures = data.pictures
          }
        })
        this.pyqList = newPyqList
      }
    },
    components: {
      picturePreview,
      customEmoji,
      commentList,
      pyqEdit,
      EmptySvg,
      userCard
    },
    filters: {
      formatDateToZH(val) {
        return formatDateToZH(val)
      }
    },
    mounted() {
      document.addEventListener('click', this.handleDocmentClick)
    },
    beforeDestroy() {
      document.removeEventListener('click', this.handleDocmentClick)
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/animation.scss';

  .pyq-com {
    position: relative;
    min-height: 240px;

    .pyq-com-wrapper {
      .item {
        background-color: #fff;
        padding: 10px;
        margin-bottom: 10px;

        .header {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #C0C4CC;
          padding: 0 0 10px;
          position: relative;

          .info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-left: 10px;

            .nickname {
              .nickname-link {
                text-decoration: none;
                color: #222222;

                &:hover {
                  text-decoration: underline;
                  color: #409EFF;
                }
              }
            }

            .time {
              color: #86847f;
              margin-top: 10px;
            }
          }

          .pyq-item-operation {
            position: absolute;
            right: 5px;
            cursor: pointer;

            .operation-list {
              position: absolute;
              right: -15px;
              width: 60px;
              text-align: center;
              background-color: #fff;
              padding: 5px;
              box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

              .operation-list-item {
                &:last-child {
                  margin-bottom: 0;
                }

                &:hover {
                  text-decoration: underline;
                }

                display: inline-block;
                margin-bottom: 5px;
                font-size: 12px;
                cursor: pointer;

                .item-icon {
                  margin-right: 5px;
                }
              }
            }
          }
        }

        .body {
          padding: 10px 0;
          text-align: left;

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

        .info {
          text-align: right;

          .operation {
            .item {
              &:hover {
                color: #c35673;
              }

              width: 40px;
              height: 40px;
              margin-left: 20px;
              font-size: 20px;
              cursor: pointer;
            }
          }
        }

        .comment-like {
          position: relative;
          margin-top: 10px;
          padding: 10px;
          border-top: 1px solid #e5e9ef;
          text-align: left;

          .like {
            &::before {
              padding: 1px;
              color: #c35673;
            }

            .like-user-link {
              text-decoration: none;
              color: #2832db;
            }
          }

          .comments {
            margin-top: 10px;
            border-top: 1px solid #fff;
          }
        }

        .comment-area {
          display: flex;
          height: 45px;
          align-items: center;
        }
      }

      .emoji-com {
        position: fixed;
      }
    }

    .pyq-edit-box {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10001;
      padding: 100px;
      background-color: rgba(0, 0, 0, 0.1);
    }

    .no-data {
      width: 100%;
      text-align: center;
      background-color: #fff;
    }
  }
</style>
