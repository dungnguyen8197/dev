import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API

class SuperAgentResource extends Resource {
  constructor() {
    super('type-service')
  }
  TypeServiceList() {
    return request({
      url: baseURL + `/${this.uri}/all`,
      method: 'get'
    })
  }

  list(data, params) {
    return request({
      url: baseURL + `/${this.uri}/search`,
      method: 'post',
      data,
      params
    })
  }

  create(data) {
    return request({
      url: baseURL + `/${this.uri}/create`,
      method: 'post',
      data
    })
  }

  remove(id) {
    return request({
      url: baseURL + `/${this.uri}/remove/${id}`,
      method: 'get'
    })
  }

  update(id, data) {
    return request({
      url: baseURL + `/${this.uri}/update/${id}`,
      method: 'post',
      data
    })
  }
}

export { SuperAgentResource as default }
