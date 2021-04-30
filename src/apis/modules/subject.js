import request from '../../utils/request'
import {stringify} from 'qs'


export default {
  getAllSubject() {
    return request.get(`/subject/all`)
  },
  changeFavorite(subjectId) {
    return request.get(`/favorite/change?subjectId=${subjectId}`)
  },
  getPageOfFavorite(data) {
    return request.get(`/favorite/all?${stringify(data)}`)
  },
  delFavorite(id) {
    return request.delete(`/favorite/delete/${id}`)
  }
}
