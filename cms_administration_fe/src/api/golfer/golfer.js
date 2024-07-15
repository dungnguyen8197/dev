import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API

class AccountResource extends Resource {
  constructor() {
    super('golfer')
  }

  searchGolfer(query) {
    return request({
      url: baseURL + `/${this.uri}/search`,
      method: 'get',
      params: query
    })
  }

  getInGolfer(data) {
    return request({
      url: baseURL + `/${this.uri}/get-in-golfer`,
      method: 'post',
      data: data
    })
  }

  checkGolferExists(data) {
    return request({
      url: baseURL + `/${this.uri}/check-golfer-exists`,
      method: 'post',
      data: data
    })
  }
}

export { AccountResource as default }
