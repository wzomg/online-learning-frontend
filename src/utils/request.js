import axios from 'axios'
import {Message} from 'element-ui'

let instance = axios.create({
  timeout: 10000,
  baseURL: '/api'
})

instance.interceptors.response.use(
  response => {
    if (response.status === 200) {
      // console.log(response)
      // if (response.data.code !== 200) {
      //   Message.Error(response.data.msg)
      //   return undefined
      // }
      return response.data
    }
  },
  error => {
    console.log('请求错误', error)
    Message({
      message: '网络超时！',
      type: 'error',
      duration: 3000
    })
    return Promise.reject(error)
  }
)

export default instance
