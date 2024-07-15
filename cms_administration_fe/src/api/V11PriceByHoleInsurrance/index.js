import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API

// const baseURL = 'https://prod-wap-wghn.vcallid.com'
class V11PriceByHoleInsurrance extends Resource {
  constructor() {
    super('price-insurrance')
  }

  lists(query) {
    return request({
      url: baseURL + `/${this.uri}/list-price-insurrance`,
      method: 'get',
      params: query
    })
  }
  listAllPackage(query) {
    return request({
      url: baseURL + `/${this.uri}/list-price-insurrance-all`,
      method: 'get',
      params: query
    })
  }
}

export { V11PriceByHoleInsurrance as default }
