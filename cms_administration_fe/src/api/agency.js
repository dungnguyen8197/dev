import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API

class AgencyResource extends Resource {
  constructor() {
    super('agency')
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

  updateStatus(data, id) {
    return request({
      url: baseURL + `/${this.uri}/update-status/${id}`,
      method: 'post',
      data: data
    })
  }
  detail(id) {
    return request({
      url: baseURL + `/${this.uri}/detail/${id}`,
      method: 'get'
    })
  }

  changePriceFacility(data, id) {
    return request({
      url: baseURL + `/${this.uri}/change-price-facility/${id}`,
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

export { AgencyResource as default }
