import Resource from '@/api/resource'
import request from '@/utils/request'

// const api = 'http://localhost:9999'

class ListPassportResource extends Resource {
  constructor() {
    super('list-passport')
  }

  list(data, params) {
    return request({
      url: `${this.uri}/all`,
      method: 'get',
      data,
      params
    })
  }
  //   remove(id) {
  //     return request({
  //       url: `${api}/${this.uri}/remove/${id}`,
  //       method: 'get'
  //     })
  //   }

  //   create(data) {
  //     return request({
  //       url: `${api}/${this.uri}/create`,
  //       method: 'post',
  //       data
  //     })
  //   }

  //   listInsurance(data, params) {
  //     return request({
  //       url: `${api}/${this.uri}/list-insurance`,
  //       method: 'get',
  //       data: data,
  //       params
  //     })
  //   }

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

export { ListPassportResource as default }
