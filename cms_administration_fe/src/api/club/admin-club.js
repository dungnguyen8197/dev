import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API

class AdminClubResource extends Resource {
  constructor() {
    super('admin-club')
  }

  search(query) {
    return request({
      url: baseURL + `/${this.uri}/search`,
      method: 'get',
      params: query
    })
  }
  list(query) {
    return request({
      url: baseURL + `/${this.uri}/list`,
      method: 'get',
      params: query
    })
  }
  list_member(query, id) {
    return request({
      url: baseURL + `/${this.uri}/list_member/${id}`,
      method: 'get',
      params: query
    })
  }
  change_status_public(data, id) {
    return request({
      url: baseURL + `/${this.uri}/change_status_public/${id}`,
      method: 'post',
      data: data
    })
  }
  // add_club_secretary(data, id) {
  //   return request({
  //     url: baseURL + `/${this.uri}/add_club_secretary/${id}`,
  //     method: 'post',
  //     data: data
  //   })
  // }
  add_user_club(data, id) {
    return request({
      url: baseURL + `/${this.uri}/add_user_club/${id}`,
      method: 'post',
      data: data
    })
  }

  store(data) {
    return request({
      url: baseURL + `/${this.uri}/store`,
      method: 'post',
      data: data
    })
  }

  detail(id) {
    return request({
      url: baseURL + `/${this.uri}/detail/${id}`,
      method: 'post'
    })
  }
  update(data, id) {
    return request({
      url: baseURL + `/${this.uri}/update/${id}`,
      method: 'post',
      data
    })
  }
}

export { AdminClubResource as default }
