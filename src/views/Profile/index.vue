<template>
  <div class="profile-container">
    <el-card class="box-card">
      <div class="avatar">
        <img class="img" :src="imgUrl" alt="">
        <el-upload
                class="upload-demo"
                ref="upload"
                action="/api/user/updateAvatar"
                :on-success="handleSuccess"
                :with-credentials="true"
                :limit="1">
          <el-button size="mini">更换头像</el-button>
        </el-upload>
      </div>
      <el-form
              :model="form1"
              status-icon
              ref="form1"
              label-position="right"
              label-width="80px"
              :rules="rules1"
              class="inputList"
      >
        <el-form-item label="账号" prop="username" class="listItem">
          <span>{{form1.username}}</span>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" class="listItem">
          <span v-if="!edit1">{{form1.email}}</span>
          <el-input
                  v-else
                  size="large"
                  v-model="form1.email"
                  type="email"
                  placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone" class="listItem">
          <span v-if="!edit1">{{form1.phone}}</span>
          <el-input
                  v-else
                  size="large"
                  v-model="form1.phone"
                  placeholder="请输入手机"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" class="listItem">
          <el-radio-group v-model="form1.sex" class="sexBox">
            <el-radio :disabled="!edit1" :label="0">男</el-radio>
            <el-radio :disabled="!edit1" :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="edit1" type="primary" @click="edit1Click">编辑</el-button>
          <el-button @click="save1">保存</el-button>
        </el-form-item>
      </el-form>
      <el-form
              :model="form2"
              status-icon
              ref="form2"
              label-position="right"
              label-width="80px"
              :rules="rules2"
              class="inputList"
      >
        <el-form-item label="旧密码" prop="oldPassword" class="listItem">
          <span v-if="!edit2">******</span>
          <el-input
                  v-else
                  size="large"
                  type="password"
                  v-model="form2.oldPassword"
                  placeholder="请输入旧密码"
          ></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword" class="listItem">
          <span v-if="!edit2">******</span>
          <el-input
                  v-else
                  size="large"
                  type="password"
                  v-model="form2.newPassword"
                  placeholder="请输入新密码"
          ></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="newPasswordConfirm" class="listItem">
          <span v-if="!edit2">******</span>
          <el-input
                  v-else
                  size="large"
                  type="password"
                  v-model="form2.newPasswordConfirm"
                  placeholder="请输入确认密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="edit1" type="primary" @click="edit2Click">编辑</el-button>
          <el-button @click="save2">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {remove} from 'js-cookie'

  export default {
    data() {
      const validatePhone = (rule, value, callback) => {
        const pattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        if (!pattern.test(value)) {
          callback(new Error("手机号码格式不正确！"))
        } else {
          callback();
        }
      };
      const validateEmail = (rule, value, callback) => {
        const pattern = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/
        if (!pattern.test(value)) {
          callback(new Error("邮箱格式不正确！"))
        } else {
          callback();
        }
      };
      return {
        imgUrl: 'http://images.nowcoder.com/head/16t.png',
        form1: {
          email: '',
          phone: '',
          sex: 0
        },
        form2: {
          oldPassword: '',
          newPassword: '',
          newPasswordConfirm: ''
        },
        rules1: {
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: validateEmail, trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {validator: validatePhone, trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'change'},
          ],
        },
        rules2: {
          oldPassword: [
            {required: true, message: '请输入旧密码', trigger: 'blur'},
          ],
          newPassword: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
          ],
          newPasswordConfirm: [
            {required: true, message: '请输入确认密码', trigger: 'blur'},
          ]
        },
        edit1: false,
        edit2: false
      }
    },
    methods: {
      edit1Click() {
        this.edit1 = true
      },
      edit2Click() {
        this.edit2 = true
      },
      handleSuccess(res) {
        //清空文件列表
        this.$refs.upload.clearFiles()
        this.imgUrl = res.data.imgUrl
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        userInfo.avatar = this.imgUrl
        localStorage.setItem("userInfo", JSON.stringify(userInfo))
        this.$emit('getUserInfo', userInfo)
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      },
      save1() {
        if (this.edit1) {
          this.$refs.form1.validate((valid) => {
            if (!valid) return
            this.$http.updateProfile(this.form1).then(res => {
              if (res.code === 200) {
                this.edit1 = false
                this.$message({
                  type: 'success',
                  message: res.msg
                })
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
          })
        }
      },
      save2() {
        if (this.edit2) {
          this.$refs.form2.validate((valid) => {
            if (valid) {
              if (this.form2.newPassword !== this.form2.newPasswordConfirm) {
                this.$message({
                  type: 'error',
                  message: '新密码和确认密码不一致'
                })
                return false
              }
              // 接口
              this.$http.updatePassword(this.form2).then(res => {
                if (res.code === 200) {
                  remove('ticket')
                  this.edit2 = false
                  this.$message({
                    type: 'success',
                    message: res.msg
                  })
                  setTimeout(() => {
                    this.$router.push('/login')
                  }, 2000)
                } else {
                  this.$message({
                    type: 'error',
                    message: res.msg
                  })
                }
              })
            } else {
              this.$message({
                type: 'error',
                message: '校验不通过，请重新输入'
              })
            }
          })
        }
      },
      getUserProfile() {
        const uid = JSON.parse(localStorage.getItem('userInfo')).id
        this.$http.getProfilePage(uid).then(res => {
          if (res.code === 200) {
            this.form1 = res.data.user
            this.imgUrl = this.form1.avatar
          }
        })
      }
    },
    created() {
      this.getUserProfile()
    }
  }
</script>

<style lang="scss" scoped>
  .profile-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 20px 0 10px;
  }

  ::v-deep .el-card {
    width: 600px;
    margin: 0 auto;
  }

  .btns {
    margin: 30px auto 30px;

    .edit1 {
      margin-right: 30px;
    }
  }

  .img {
    border-radius: 50%;
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
  }

  .inputList {
    width: 100%;
  }

  .listItem {
    display: flex;
    height: 50px;
    align-items: center;
    margin-bottom: 0;

    &:nth-child(even) {
      background-color: #f7f7f7;
    }
  }

  ::v-deep .el-form-item__error {
    top: 80%;
    width: 120px;
    text-align: left;
  }

  ::v-deep .el-input__inner {
    height: 27px;
  }

  ::v-deep .el-form-item__content {
    margin-left: 0 !important;
    text-align: center;
  }

  ::v-deep .el-button--mini {
    padding: 7px 8px;
  }

  ::v-deep .el-card__body {
    padding: 40px 20px 0;
  }

  ::v-deep .el-form-item__label {
    color: #999999;
    margin-right: 30px;
  }

  ::v-deep .el-upload-list {
    display: none;
  }
</style>
