import request from '../../utils/request'
import {stringify} from 'qs'


export default {
  addPost(data) {
    return request.post(`/post/add`, data)
  },
  getPageOfPost(data) {
    return request.get(`/post/all?${stringify(data)}`)
  },
  getPostById(id) {
    return request.get(`/post/get/${id}`)
  },
  updatePost(data) {
    return request.post(`/post/update`, data)
  },
  delPost(id) {
    return request.delete(`/post/del/${id}`)
  },
  changeLove(id) {
    return request.get(`/love/change?postId=${id}`)
  },
  addComment(data) {
    return request.post(`/comment/add`, data)
  },
}
