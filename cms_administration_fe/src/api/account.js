import Resource from '@/api/resource'
import request from '@/utils/request'

class AccountResource extends Resource {
  constructor() {
    super('admin')
  }
  Lists(data) {
    return request({
      url: `/${this.uri}/list-admin`,
      method: 'post',
      data
    })
  }

  AccountList(query) {
    return request({
      url: `/${this.uri}/search?${query}`,
      method: 'get',
      data: query
    })
  }

  storeAccount(resource) {
    return request({
      url: `/${this.uri}/create`,
      method: 'post',
      data: resource
    })
  }

  updateAccount(data, id) {
    return request({
      url: `/${this.uri}/update-admin-role/${id}`,
      method: 'post',
      data: data
    })
  }

  ChangePassword(resource) {
    return request({
      url: `/${this.uri}/change_pass`,
      method: 'post',
      data: resource
    })
  }

  changeProfile(resource) {
    return request({
      url: `/${this.uri}/update_profile`,
      method: 'post',
      data: resource
    })
  }

  profileList() {
    return request({
      url: `/${this.uri}/get_profile`,
      method: 'get'
    })
  }

  forgotPassword(resource) {
    return request({
      url: `/${this.uri}/forgot_password`,
      method: 'post',
      data: resource
    })
  }

  SendEmail(resource) {
    return request({
      url: `/${this.uri}/get_captcha_verify`,
      method: 'post',
      data: resource
    })
  }

  deleteAccount(id) {
    return request({
      url: `/${this.uri}/remove/${id}`,
      method: 'get'
    })
  }

  accountTelesale() {
    return request({
      url: `/${this.uri}/list_telesale`,
      method: 'get'
    })
  }

  searchAdmin(query) {
    return request({
      url: `/${this.uri}/search`,
      method: 'get',
      params: query
    })
  }

  getByLevel(roleId, adminId) {
    return request({
      url: `/${this.uri}/get-by-level`,
      method: 'post',
      data: { role_id: roleId },
      params: { admin_id: adminId }
    })
  }

  getChildren(admin_id) {
    return request({
      url: `/${this.uri}/get-children/${admin_id}`,
      method: 'get'
    })
  }

  storeAccountClub(resource) {
    return request({
      url: `/${this.uri}/create-admin-club`,
      method: 'post',
      data: resource
    })
  }

  updateAccountClub(data, id) {
    return request({
      url: `/${this.uri}/update-admin-club/${id}`,
      method: 'post',
      data: data
    })
  }

  deleteAccountClub(data, id) {
    return request({
      url: `/${this.uri}/remove-admin-club/${id}`,
      method: 'post',
      data: data
    })
  }

  updateAdminBoss(data, id) {
    return request({
      url: `/${this.uri}/update-admin-boss/${id}`,
      method: 'post',
      data: data
    })
  }

  listAccountHIO(query) {
    return request({
      url: `${this.uri}/list-account-hio`,
      method: 'get',
      params: query
    })
  }

  storeAccountHIO(resource) {
    return request({
      url: `/${this.uri}/create-account-hio`,
      method: 'post',
      data: resource
    })
  }

  updateAccountHIO(data, id) {
    return request({
      url: `/${this.uri}/update-account-hio/${id}`,
      method: 'post',
      data: data
    })
  }
}

export { AccountResource as default }
