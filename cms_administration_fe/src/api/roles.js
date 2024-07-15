import Resource from '@/api/resource'
import request from '@/utils/request'

class RoleResource extends Resource {
  constructor() {
    super('role')
  }

  RoleList(query) {
    return request({
      url: `/${this.uri}/all`,
      method: 'get',
      params: query
    })
  }

  storeRole(resource) {
    return request({
      url: `/${this.uri}/create`,
      method: 'post',
      data: resource
    })
  }

  updateRole(resource) {
    return request({
      url: `/${this.uri}/update`,
      method: 'post',
      data: resource
    })
  }

  deleteRole(id) {
    return request({
      url: `/${this.uri}/delete/${id}`,
      method: 'get'
    })
  }

  listPermission(RoleId) {
    return request({
      url: `permission/all`,
      method: 'GET'
    })
  }

  addPermissionToRole(data, id) {
    return request({
      url: `/${this.uri}/change-permission-by-role/${id}`,
      method: 'post',
      data: data
    })
  }

  getPermissionByRole(data) {
    return request({
      url: `/${this.uri}/permission-by-role`,
      method: 'post',
      data: data
    })
  }

  getUnder() {
    return request({
      url: `/${this.uri}/get-under`,
      method: 'post'
    })
  }
}

export { RoleResource as default }
