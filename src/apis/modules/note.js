import request from '../../utils/request'

export default {
  getPageOfNote(pageIndex) {
    return request.get(`/note/all/${pageIndex}`)
  },
  delNote(id) {
    return request.delete(`/note/delete/${id}`)
  }
}
