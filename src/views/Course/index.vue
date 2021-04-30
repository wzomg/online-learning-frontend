<template>
  <div class="course-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a href="/api/upload/files/template.xlsx" download="template.xlsx">点击下载模版</a>
        </el-tag>
      </el-form-item>
      <el-form-item label="选择Excel">
        <el-upload
                ref="upload"
                :on-success="fileUploadSuccess"
                :on-error="fileUploadError"
                :limit="1"
                action="/api/subject/add"
                :with-credentials="true"
                name="file"
                accept="application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    methods: {
      //上传成功
      fileUploadSuccess() {
        this.$message({
          type: 'success',
          message: '添加课程信息成功'
        })
        //路由跳转
        this.$router.push({path: '/home'})
      },
      //上传失败
      fileUploadError() {
        this.$message({
          type: 'error',
          message: '添加课程信息失败'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .course-container {
    width: 400px;
    margin: 60px auto;
  }

  ::v-deep .el-form-item__content {
    text-align: left;
  }
</style>
