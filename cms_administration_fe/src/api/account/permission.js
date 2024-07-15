import Resource from '@/api/resource'
import request from '@/utils/request'

class PermissionResource extends Resource {
  constructor() {
    super('permission')
  }

  list(data, params) {
    return request({
      url: `/${this.uri}/search`,
      method: 'post',
      data,
      params
    })
  }

  create(data) {
    return request({
      url: `/${this.uri}/create`,
      method: 'post',
      data
    })
  }

  remove(id) {
    return request({
      url: `/${this.uri}/remove/${id}`,
      method: 'get'
    })
  }

  update(id, data) {
    return request({
      url: `/${this.uri}/update/${id}`,
      method: 'post',
      data
    })
  }
}

export { PermissionResource as default }
