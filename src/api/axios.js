import axios from 'axios'
import { Message } from 'ant-design-vue'
const HttpRequest = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/musicApi' : '/api/',
  timeout: 120000
})
HttpRequest.interceptors.request.use(
  config => {
    return config
  },
  error => Message.error(`请求出错，code：${error}`)
)
HttpRequest.interceptors.response.use(
  res => {
    if (res.status === 200) {
      return res.data
    } else {
      Message.error(`请求出错，code：${res.status}`)
      return Promise.reject(res)
    }
  },
  error => {
    Message.error(`请求出错，code：${error}`)
    return Promise.reject(error)
  }
)

export default HttpRequest
