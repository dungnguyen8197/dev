import Resource from '@/api/resource'
import request from '@/utils/request'

class RoleResource extends Resource {
  constructor() {
    super('role')
  }

  list(data) {
    return request({
      url: `/${this.uri}/get-list-role`,
      method: 'post',
      data
    })
  }

  getAllRole(data) {
    return request({
      url: `/${this.uri}/get-all-role`,
      method: 'post',
      data
    })
  }

  getAllRoleClub(data) {
    return request({
      url: `/${this.uri}/get-all-role-club`,
      method: 'post',
      data
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

  update(data) {
    return request({
      url: `/${this.uri}/update`,
      method: 'post',
      data
    })
  }
}

export { RoleResource as default }
