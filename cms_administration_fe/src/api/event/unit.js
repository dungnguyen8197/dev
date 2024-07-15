import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API
// const baseURL = 'http://localhost:9999'

class unitResource extends Resource {
  constructor() {
    super('event-club/organization')
  }

  lists(query) {
    return request({
      url: baseURL + `/${this.uri}/lists`,
      method: 'get',
      params: query
    })
  }
  store(resource) {
    return request({
      url: baseURL + `/${this.uri}/store`,
      method: 'post',
      data: resource
    })
  }

  update(data, id) {
    return request({
      url: baseURL + `/${this.uri}/update/${id}`,
      method: 'post',
      data: data
    })
  }

  remove(id) {
    return request({
      url: baseURL + `/${this.uri}/remove/${id}`,
      method: 'get'
    })
  }
}

export { unitResource as default }
