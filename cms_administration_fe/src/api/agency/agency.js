import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API

class AgencyPaxResource extends Resource {
  constructor() {
    super('agency')
  }

  searchAgency(query) {
    return request({
      url: baseURL + `/${this.uri}/search`,
      method: 'get',
      params: query
    })
  }

  listPriceFacilityAgency(query) {
    return request({
      url: baseURL + `/${this.uri}/list_price_facility_agency`,
      method: 'get',
      params: query
    })
  }
}

export { AgencyPaxResource as default }
