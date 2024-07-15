import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API

class AdvResourceNotify extends Resource {
  constructor() {
    super('adv/notify')
  }

  listNotify(data) {
    return request({
      url: baseURL + `/${this.uri}/list`,
      method: 'post',
      data: data
    })
  }

  storeNotify(data) {
    return request({
      url: baseURL + `/${this.uri}/store`,
      method: 'post',
      data: data
    })
  }

  updateNotify(data) {
    return request({
      url: baseURL + `/${this.uri}/update`,
      method: 'post',
      data: data
    })
  }

  sendNotify(data) {
    return request({
      url: baseURL + `/${this.uri}/send-notify`,
      method: 'post',
      data: data
    })
  }
}

export { AdvResourceNotify as default }
