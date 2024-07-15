import Resource from '@/api/resource'
import request from '@/utils/request'
// const baseURL = process.env.VUE_APP_BASE_API

class SupplierResource extends Resource {
  constructor() {
    super('supplier')
  }

  lists(query) {
    return request({
      url: `/${this.uri}/lists`,
      method: 'get',
      params: query
    })
  }
  store(resource) {
    return request({
      url: `/${this.uri}/store`,
      method: 'post',
      data: resource
    })
  }

  update(data, id) {
    return request({
      url: `/${this.uri}/update/${id}`,
      method: 'post',
      data: data
    })
  }

  remove(id) {
    return request({
      url: `/${this.uri}/remove/${id}`,
      method: 'get'
    })
  }
}

export { SupplierResource as default }
