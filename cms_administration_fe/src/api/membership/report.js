import Resource from '@/api/resource'
import request from '@/utils/request'

// const api = 'http://localhost:9999'

class ListGolferResource extends Resource {
  constructor() {
    super('report')
  }

  reportAll(query) {
    return request({
      url: `${this.uri}/report_all`,
      method: 'get',
      params: query
    })
  }

  exportExcel(query) {
    return request({
      url: `${this.uri}/export-excel`,
      method: 'get',
      params: query
    })
  }

  countNonMember(query) {
    return request({
      url: `${this.uri}/count-non-member`,
      method: 'get',
      params: query
    })
  }
  countMember(query) {
    return request({
      url: `${this.uri}/count-member`,
      method: 'get',
      params: query
    })
  }
  countMemberVip(query) {
    return request({
      url: `${this.uri}/count-member-vip`,
      method: 'get',
      params: query
    })
  }
  countMemberLuxury(query) {
    return request({
      url: `${this.uri}/count-member-luxury`,
      method: 'get',
      params: query
    })
  }

  countMemberInfinite(query) {
    return request({
      url: `${this.uri}/count-member-infinite`,
      method: 'get',
      params: query
    })
  }
}

export { ListGolferResource as default }
