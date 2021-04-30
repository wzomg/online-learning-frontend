<template>
  <div class="custom-comment-list-com">
    <div class="comment-list-wrapper">
      <div class="comment-item" v-for="item in paginationCommentList" :key="item.id">
        <div class="avatar">
          <el-avatar :size="40" :src="item.authorInfo.avatar" @error="()=>true">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
          </el-avatar>
        </div>
        <div class="content">
          <p class="user-content ellipsis">
                          <span>
                          <el-popover
                                  placement="top"
                                  width="240"
                                  trigger="hover">
                                      <div class="user-card-body">
                                                    <div class="header">
                                                        <div class="user-card-avatar">
                                                            <el-avatar :size="50" :src="item.authorInfo.avatar"
                                                                       @error="()=>true">
                                                              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                                                            </el-avatar>
                                                        </div>

                                                              <div class="user-card-info">
          <p class="info-item-nickname ellipsis">{{item.authorInfo.username}}</p>
        </div>
      </div>

    </div>
    <span slot="reference" class="user-content-link">{{item.authorInfo.username}}</span>
    </el-popover>
    </span>：
    <span>{{item.content}}</span>
    </p>

    <span class="time-content secondary-font">{{item.gmtCreate | formatDate}}</span>
    <span class="reply secondary-font operation-text"
          @click="showReplyArea(item.id, item.level, item.authorInfo)">回复</span>
    <div class="reply-box">
      <div class="reply-item" v-for="replyItem in item.replyList.slice(0, showMaxReply)" :key="replyItem.id">
        <div class="reply-item-avatar">
          <el-avatar :size="40" :src="replyItem.authorInfo.avatar" @error="()=>true">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
          </el-avatar>
        </div>
        <div class="reply-item-content">
          <p class="content-header">
              <span class="name">{{replyItem.authorInfo.username}}
                <span class="reply-to-author"
                      v-if="replyItem.level === 2">
                  回复@{{replyItem.targetInfo && replyItem.targetInfo.username}}
                </span>：
              </span>
            {{replyItem.content}}
          </p>
          <span class="time secondary-font">{{replyItem.gmtCreate | formatDate}}</span>
          <span class="reply secondary-font operation-text"
                @click="showReplyArea(item.id, replyItem.level, replyItem.authorInfo)">回复</span>
        </div>
      </div>
      <transition-group v-if="viewMoreReplyMap[item.id]">
        <div class="reply-item" v-for="replyItem in item.replyList.slice(showMaxReply)" :key="replyItem.id">
          <div class="reply-item-avatar">
            <el-avatar :size="40" :src="replyItem.authorInfo.avatar" @error="()=>true">
              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
            </el-avatar>
          </div>
          <div class="reply-item-content">
            <p class="content-header">
                                                      <span class="name">{{replyItem.authorInfo.username}}
                                                        <span class="reply-to-author" v-if="replyItem.level === 2">
                                                          回复@{{replyItem.targetInfo && replyItem.targetInfo.username}}
                                                        </span>：
                                                      </span>
              {{replyItem.content}}
            </p>
            <span class="time secondary-font">{{replyItem.gmtCreate | formatDate}}</span>
            <span class="reply secondary-font operation-text"
                  @click="showReplyArea(item.id, replyItem.level, replyItem.authorInfo)">回复</span>
          </div>
        </div>
      </transition-group>
      <span class="view-more-reply-item secondary-font">
                                      <span class="reply-count" v-if="item.replyList.length">
                                        共{{item.replyList.length}}条回复{{item.replyList.length > showMaxReply ? '，' : ''}}
                                      </span>
                                      <span class="operation-text"
                                            v-if="!viewMoreReplyMap[item.id] && item.replyList.length > showMaxReply"
                                            @click="viewMoreReplyMap[item.id] = !viewMoreReplyMap[item.id]">查看</span>
                                      <span class="operation-text"
                                            v-if="viewMoreReplyMap[item.id] && item.replyList.length > showMaxReply"
                                            @click="viewMoreReplyMap[item.id] = !viewMoreReplyMap[item.id]">收起</span>
                          </span>
    </div>
    <div class="reply-area" v-if="replyAreaShowMap[item.id]">
      <el-input
              :ref="'reply-inp'+item.id"
              v-model="replyContentMap[item.id]"
              style="margin-right: 5px"
              :placeholder="replyContentPlaceholderMap[item.id]"/>
      <el-button type="success" size="mini" @click="doReplyComment(item.id)">回复</el-button>
    </div>
  </div>
  </div>

  <div class="comment-operation-list secondary-font">
                              <span class="operation-text expand"
                                    v-if="commentlist.length> 3 && !viewMoreComment"
                                    @click="viewMoreComment = true">点击查看更多</span>
    <span class="operation-text fold"
          v-if="viewMoreComment"
          @click="viewMoreComment = false">点击收起评论</span>
  </div>
  </div>
  </div>

</template>

<script>
  import {formatDateToZH} from '@/utils'

  export default {
    props: ["commentlist", "pyqid"],
    data() {
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        replyContent: '', // 回复内容
        replyAreaShowMap: {}, // 展示当前回复的那一条评论
        replyContentMap: {}, // 回复的内容，键为被回复的评论ID，值为回复内容
        viewMoreReplyMap: {}, // 那一条评论的子评论是处于查看更多状态的
        replyContentPlaceholderMap: {},
        showMaxReply: 3,
        currentReplyCommentLevel: 0,
        currentReplyToAuthorId: {},
        viewMoreComment: false
      }
    },
    methods: {
      doReplyComment(id) {
        const postId = this.pyqid
        const content = this.replyContentMap[id]
        const uid = this.userInfo.id
        const parentId = id
        const level = this.currentReplyCommentLevel === 2 ? this.currentReplyCommentLevel : this.currentReplyCommentLevel + 1
        const targetId = this.currentReplyToAuthorId.id
        this.$http.addComment({
          postId, content, uid, parentId, level, targetId
        }).then(res => {
          if (res.code === 200) {
            const replyItem = {
              ...res.data.comment,
              authorInfo: {
                avatar: this.userInfo.avatar,
                username: this.userInfo.username,
                id: this.userInfo.id
              },
              targetInfo: {
                id: this.currentReplyToAuthorId.id,
                username: this.currentReplyToAuthorId.username,
                avatar: this.currentReplyToAuthorId.avatar
              }
            }

            this.$emit('addchild', this.pyqid, id, replyItem)
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
          this.replyContentMap[id] = "" //清空回复框输入的内容
        })
      },
      /**
       * 父评论的Id，当前要回复评论的level，被回复评论的用户信息
       */
      showReplyArea(id, level, authorInfo) {
        const replyAreaShowMap = this.replyAreaShowMap
        const newReplyAreaShowMap = {...replyAreaShowMap}
        for (const key in newReplyAreaShowMap) {
          if (newReplyAreaShowMap.hasOwnProperty(key)) {
            newReplyAreaShowMap[key] = false
          }
        }
        newReplyAreaShowMap[id] = !this.replyAreaShowMap[id]
        this.replyAreaShowMap = newReplyAreaShowMap
        const ref = 'reply-inp' + id
        if (newReplyAreaShowMap[id]) { //该评论组件展示才聚焦
          this.$nextTick(() => {
            this.$refs[ref] && this.$refs[ref][0].focus()
          })
        }
        this.currentReplyCommentLevel = level
        this.currentReplyToAuthorId = authorInfo
        this.replyContentPlaceholderMap[id] = `回复 @${this.currentReplyToAuthorId.username}（请文明发言）`
      },
      viewMoreReply(id) {
        this.viewMoreReplyMap[id] = true
      }
    },
    computed: {
      paginationCommentList() {
        if (this.viewMoreComment) {
          return this.commentlist.slice()
        } else {
          return this.commentlist.slice(0, 3)
        }
      }
    },
    filters: {
      formatDate(val) {
        return formatDateToZH(val)
      }
    },
    created() {
      this.commentlist.forEach(item => {
        this.$set(this.replyAreaShowMap, item.id, false)
        this.$set(this.replyContentMap, item.id, '')
        this.$set(this.viewMoreReplyMap, item.id, false)
        this.$set(this.replyContentPlaceholderMap, item.id, '请文明发言')
      })
    },
  }
</script>

<style lang="scss">
  .custom-comment-list-com {
    .comment-list-wrapper {
      .comment-item {
        position: relative;
        margin-bottom: 10px;

        &:last-child {
          margin-bottom: 0;
        }

        .avatar {
          // float: left;
          display: inline-block;
          position: absolute;
          left: 0;
          top: 0;
        }

        .content {
          display: inline-block;
          padding-left: 50px;
          font-size: 12px;
          width: 100%;

          .user-content {
            font-size: 16px;
            margin-bottom: 3px;

            .user-content-link {
              text-decoration: none;
              color: #2832db;
            }
          }

          .time-content {
            margin: 5px 0 0 0;
          }

          .reply {
            font-size: 13px;
            line-height: 17px;
            margin-left: 8px;
            color: #67b2e9;
            cursor: pointer;
          }

          .reply-box {
            .reply-item {
              position: relative;
              margin: 5px 0;
              min-height: 40px;

              .reply-item-avatar {
                position: absolute;
                left: 0;
                top: 0;
              }

              .reply-item-content {
                margin-left: 50px;

                .content-header {
                  font-size: 16px;
                  margin: 0 0 5px 0;

                  .name {
                    font-family: "'Microsoft YaHei', Arial, Helvetica, sans-serif"
                  }
                }
              }
            }

            .view-more-reply-item {
              .operation-text {
                color: #67b2e9;
                cursor: pointer;
              }
            }
          }

          .reply-area {
            display: flex;
            margin: 5px 0;
          }
        }
      }

      .comment-operation-list {
        text-align: center;
        .operation-text {
          color: #67b2e9;
          cursor: pointer;
        }
      }
    }
  }
</style>
