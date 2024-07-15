import Resource from '@/api/resource'
import request from '@/utils/request'

// const api = 'http://localhost:9999'

class RevenueAgentHIOResource extends Resource {
  constructor() {
    super('revenue-agent')
  }

  all(data, params) {
    return request({
      url: `${this.uri}/all`,
      method: 'get',
      data,
      params
    })
  }

  listInsuranceByAgent(id) {
    return request({
      url: `${this.uri}/list-insurance-by-agent/${id}`,
      method: 'get'
    })
  }

  //   create(data) {
  //     return request({
  //       url: `${api}/${this.uri}/create`,
  //       method: 'post',
  //       data
  //     })
  //   }

  // searchAccount(data, params) {
  //   return request({
  //     url: `${api}/${this.uri}/search`,
  //     method: 'post',
  //     data: data,
  //     params
  //   })
  // }

  // updateAccount(data, id) {
  //   return request({
  //     url: `/${this.uri}/update-admin-role/${id}`,
  //     method: 'post',
  //     data: data
  //   })
  // }

  // ChangePassword(resource) {
  //   return request({
  //     url: `/${this.uri}/change_pass`,
  //     method: 'post',
  //     data: resource
  //   })
  // }
}

export { RevenueAgentHIOResource as default }
