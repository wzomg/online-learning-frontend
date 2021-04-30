import request from '../../utils/request'
import {stringify} from 'qs'

export default {
  // 登录
  login(data) {
    return request.post(`/login?${stringify(data)}`)
  },
  //注册
  register(data) {
    return request.post(`/register`, data)
  },
  // 退出登录
  logout() {
    return request.get(`/logout`)
  },
  // 获取用户信息
  getProfilePage(uid) {
    return request.get(`/user/profile/${uid}`)
  },
  // 更新用户信息
  updateProfile(data) {
    return request.post(`/user/updateProfile`, data)
  },
  // 修改密码
  updatePassword(data) {
    return request.post(`/user/password`, data)
  }
}
