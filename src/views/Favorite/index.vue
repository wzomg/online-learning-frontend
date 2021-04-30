<template>
  <div class="favorite-container">
    <div class="favorite-header">
      <h1 class="title">
        <i class="el-icon-d-arrow-right"></i>
        收&nbsp;&nbsp;藏&nbsp;&nbsp;夹</h1>
      <div class="search">
        <el-input v-model="searchContent" placeholder="请输入内容"></el-input>
        <el-button type="primary" @click="search"><i class="el-icon-search"></i></el-button>
      </div>
    </div>
    <el-table
            :data="tableData"
            border
            style="width: 100%">
      <el-table-column
              fixed
              prop="index"
              label="序号"
              width="50">
      </el-table-column>
      <el-table-column
              prop="title"
              label="课程标题"
              width="200">
      </el-table-column>
      <el-table-column
              prop="link"
              label="学习链接"
      >
        <template slot-scope="{row}">
          <span @click="goToLearn(row.link)" style="cursor: pointer">
            {{row.link}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
              prop="gmtCreate"
              label="收藏时间"
              width="200"
      >
        <template slot-scope="{row}">
          <span>{{dayjs(row.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column
              fixed="right"
              label="操作"
              width="100">
        <template slot-scope="{row}">
          <el-button type="danger" size="mini" round @click="delFavoriteItem(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :page-size="5"
            :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {showDeleteTip} from "../../utils";

  export default {
    components: {},
    data() {
      return {
        tableData: [
          {
            index: '1',
            title: '王小虎',
            link: '上海',
            gmtCreate: '2019-10-11 10:11:10',
          }
        ],
        searchContent: '',
        total: 0,
        pageIndex: 1,
        dayjs
      }
    },
    created() {
      this.handleMockData()
    },
    methods: {
      // 页面改变
      handleCurrentChange(page) {
        console.log("当前页为：", page)
        this.pageIndex = page
        this.handleMockData(this.searchContent, true)
      },
      handleMockData(content, flag) {
        const param = {
          pageIndex: flag ? this.pageIndex : 1,
          searchContent: content ? content : ''
        }
        this.$http.getPageOfFavorite(param).then(res => {
          if (res.code === 200) {
            this.tableData = res.data.favoriteList
            this.tableData.map((item, index) => item.index = index + 1)
            this.total = res.data.total
          }
        })
      },
      search() {
        this.handleMockData(this.searchContent)
      },
      goToLearn(path) {
        window.open(path, '_blank');
      },
      delFavoriteItem(id) {
        showDeleteTip.call(this, '课程收藏', () => {
          this.$http.delFavorite(id).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.handleMockData()
            } else {
              this.$message({
                type: 'success',
                message: res.msg
              })
            }
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .favorite-container {
    padding: 10px 20vw;
  }

  .favorite-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    float: left;
    font-size: 20px;
    padding: 20px 0 30px;
  }

  .el-icon-d-arrow-right {
    font-size: 18px;
  }

  .search {
    display: flex;
  }

  .el-icon-search {
    color: #fff;
  }

  ::v-deep .el-pagination {
    margin: 20px 0;
  }

  ::v-deep .el-upload-list {
    display: none;
  }

  ::v-deep .el-table td, ::v-deep .el-table th {
    padding: 8px 0;
  }
</style>
