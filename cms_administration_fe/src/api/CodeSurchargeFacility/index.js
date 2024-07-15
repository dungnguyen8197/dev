import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API

class SurchargeFacilityResource extends Resource {
  constructor() {
    super('surcharge-facility')
  }

  lists(data) {
    return request({
      url: baseURL + `/${this.uri}/lists`,
      method: 'post',
      data: data
    })
  }

  search(data) {
    return request({
      url: baseURL + `/${this.uri}/search`,
      method: 'post',
      data: data
    })
  }

  created(data) {
    return request({
      url: baseURL + `/${this.uri}/created`,
      method: 'post',
      data: data
    })
  }

  update(data, id) {
    return request({
      url: baseURL + `/${this.uri}/update/${id}`,
      method: 'post',
      data: data
    })
  }

  deleted(data) {
    return request({
      url: baseURL + `/${this.uri}/deleted`,
      method: 'post',
      data: data
    })
  }
}

export { SurchargeFacilityResource as default }
