import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = 'https://api-payment-prod.vcallid.com'
class AccountMiSaResource extends Resource {
  constructor() {
    super('api/v1/paymenthub')
  }

  list(data, params) {
    return request({
      url: baseURL + `/${this.uri}/get_employee`,
      method: 'post',
      data,
      params
    })
  }

  create(data) {
    return request({
      url: baseURL + `/${this.uri}/create_new_employee`,
      method: 'post',
      data
    })
  }

  remove(data) {
    return request({
      url: baseURL + `/${this.uri}/remove_employee`,
      method: 'post',
      data
    })
  }

  update(data) {
    return request({
      url: baseURL + `/${this.uri}/update_employee`,
      method: 'post',
      data
    })
  }
}

export { AccountMiSaResource as default }
