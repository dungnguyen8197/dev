import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getRefreshToken, setToken, getTokenListMenuItem } from '@/utils/auth'

const baseURL = process.env.VUE_APP_BASE_API

// create an axios instance
const service = axios.create({
  baseURL: baseURL, // url = base url + request url
  headers: {
    Authorization: getTokenListMenuItem(),
    'auththor': getRefreshToken(),
    'X-Token': getRefreshToken(),
    'Access-Control-Allow-Origin': '*' // Allow CORS
    // account_manager: getAdmin()
  },
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 180000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    config.headers.Authorization = getTokenListMenuItem()
    config.headers['X-Token'] = getRefreshToken()
    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjc4MzMzNDY4fQ.d5WWQAGWF_TCPkvWa0ieclauQAlLierkNKGDCDfbDk5Cd-X98bLV7usneU2jXEu_cqjbJFerDRCky255aLElQLpxHmn_66tcgbTZqa5GRumTDqO4JOmgWd5vE0zRPx3xdfFPG0fILPEAA2_5bIGc4Mzd_FHMr9hqTKOn4TKxgBsCW0z9KNfO-2xevEP_gFi7xauUkdG5KUbG3UAr4sEr1s9Kfhz7H5F_lyIR99TfqV-45E4x4Av0tao2nxt5Nc16z201zjpd9OaHibpIGI1pcCkwORYQpH5pqoanO9alsYkNwyEPZbMCfenY95pD16GTswQwNlCGVmGHnSkkXF1SkBV4_rWt-J6fX1VGjq61nqr6yGm_JXvK3R_DMUN5GIZ_xC4BE6WOZQcF1SseMJalbBJKdFlRz0DpW4rsblr5Ge7KVI4ugPQFRV5PaEL6y_wx65-K8DyFYWwbFVG_YZJqzt7mVgSVZftx1yTaSYoUoAeD8FJ-zVPupv93ZM3y7Q3ybwvwZBj6KI-R9VuXlsLFWAqt7bWcUMXExhDeENGWMbgwF3YdJzG947_KzSkRsEsXK7ZOUKp7ihE3wLxQIueIyITQfmgvuG-AvtDqiffFfjbTP5e8DOLvloP2keIS1v252nZyr3i9pEBqm10KEmCx0krhQHjz5sdJStIenVtKospeB8tBjSbyCW5t0-RRo8vQOg40Jn-ySKnnBGW_jYMTy3hadbAxAQc4IprphQmvuFuVaO4YK4wNB_dEtbzAYSLpfm9vTk9eX0f95tleguH6QjEG8siA4znsMUf2SLdQNKcTniOEHp5hGcKV0gRX63zIC7X9dClOINwg3wYh6ecyXg'
    config.headers.token = token
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => Promise.reject(error)
)

// response interceptor
service.interceptors.response.use(
  async(response) => {
    const res = response.data
    if (res.error_code !== 0) {
      console.log(res.error_code)
      if (res.error_code === 403) { // Role or Permission denied
        Message.error(res.error_msg || 'Có lỗi xảy ra vui lòng thử lại sau')
        return
      }
      if (res.error_code === 498) { // No access Token or Token Invalid
        reLoginDialog()
        return
      }
      if (res.error_code === 401) { // Token Expired
        const refreshToken = getRefreshToken()
        const data = await service.post('/admin/token', { refresh_token: refreshToken })
        if (data.error_code === 0) {
          const originalRequest = response.config
          originalRequest._retry = true
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.data.token
          setToken(data.data.token)
          return service(originalRequest)
        } else { reLoginDialog() }
      }
      return res
    } else {
      return res
    }
  },
  error => {
    Message.error(error.message || 'Có lỗi xảy ra vui lòng thử lại sau')
    return Promise.reject(error)
  }
)

const reLoginDialog = () => {
  MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    confirmButtonText: 'Re-Login',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(() => store.dispatch('user/resetToken').then(() => location.reload()))
    // .catch(() => store.dispatch('user/resetToken').then(() => location.reload()))
}

export default service
