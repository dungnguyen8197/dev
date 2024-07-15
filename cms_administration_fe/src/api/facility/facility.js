import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API

class FacilityResource extends Resource {
  constructor() {
    super('facility')
  }
  listFacility(data) {
    return request({
      url: baseURL + `/${this.uri}/list`,
      method: 'post',
      data: data
    })
  }
  searchFacilityNew(data) {
    return request({
      url: baseURL + `/${this.uri}/search`,
      method: 'post',
      data: data
    })
  }

  Detail(data) {
    return request({
      url: baseURL + `/${this.uri}/detail`,
      method: 'post',
      data: data
    })
  }
}

export { FacilityResource as default }
