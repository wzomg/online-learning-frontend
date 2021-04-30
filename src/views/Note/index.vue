<template>
  <div class="note-container">
    <div class="note-header">
      <h1 class="title">
        <i class="el-icon-d-arrow-right"></i>
        笔&nbsp;&nbsp;&nbsp;&nbsp;记</h1>
      <el-upload
              ref="upload"
              class="upload-demo"
              action="/api/note/add"
              :on-success="handleSuccess"
              :with-credentials="true"
              :limit="1">
        <el-button size="small" type="primary">上传笔记</el-button>
      </el-upload>
    </div>
    <el-table
            :data="tableData"
            border
            style="width: 100%">
      <el-table-column
              fixed
              prop="index"
              label="序号"
              width="80">
      </el-table-column>
      <el-table-column
              prop="username"
              label="上传者"
              width="200">
      </el-table-column>
      <el-table-column
              prop="filename"
              label="笔记名称">
      </el-table-column>
      <el-table-column
              prop="gmtCreate"
              label="上传时间">
        <template slot-scope="{row}">
          <span>{{dayjs(row.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column
              fixed="right"
              label="操作"
              width="140">
        <template slot-scope="scope">
          <el-button type="success" size="mini" icon="el-icon-download" @click="handleDownload(scope.row)"></el-button>
          <el-button v-if="scope.row.allowDel" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
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
        tableData: [],
        dayjs,
        pageIndex: 1,
        total: 0,
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
      }
    },
    methods: {
      handleSuccess() {
        //清空文件列表
        this.$refs.upload.clearFiles()
        this.$message({
          type: 'success',
          message: '上传成功'
        })
        this.loadTableData(this.pageIndex)
      },
      // 页面改变
      handleCurrentChange(page) {
        console.log("当前页：", page)
        this.pageIndex = page
        this.loadTableData(page)
      },
      loadTableData(pageIndex) {
        this.$http.getPageOfNote(pageIndex || 1).then(res => {
          if (res.code === 200) {
            this.tableData = res.data.noteList || []
            this.tableData.map((item, index) => {
              item.index = index + 1
              item.allowDel = item.uid === this.userInfo.id
            })
            this.total = res.data.total
          }
        })
      },
      handleDownload(data) {
        const aNode = document.createElement('a')
        aNode.setAttribute('download', data.filename);
        aNode.setAttribute('href', data.downloadUrl + '?filename=' + data.filename);// href链接
        aNode.click()
        aNode.style.display = 'none'
      },
      handleDelete(data) {
        showDeleteTip.call(this, '笔记', () => {
          this.$http.delNote(data.id).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              if(this.tableData.length === 1 && this.pageIndex - 1 > 0) {
                this.pageIndex--;
                this.loadTableData(this.pageIndex)
              } else {
                this.loadTableData(this.pageIndex)
              }
            } else {
              this.$message({
                type: 'success',
                message: res.msg
              })
            }
          })
        })
      }
    },
    created() {
      this.loadTableData()
    }
  }
</script>

<style scoped>
  .note-container {
    padding: 10px 20vw;
  }

  .note-header {
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
    color: #409eff;
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
