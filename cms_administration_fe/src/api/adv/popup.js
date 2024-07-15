import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API

class AdvResource extends Resource {
  constructor() {
    super('adv/popup')
  }

  storeAdv(data) {
    return request({
      url: baseURL + `/${this.uri}/store`,
      method: 'post',
      data: data,
      params: data
    })
  }

  updateAdv(data) {
    return request({
      url: baseURL + `/${this.uri}/update`,
      method: 'post',
      data: data,
      params: data
    })
  }

  activeAdv(data) {
    return request({
      url: baseURL + `/${this.uri}/active`,
      method: 'post',
      data: data,
      params: data
    })
  }

  listAdv(data) {
    return request({
      url: baseURL + `/${this.uri}/list`,
      method: 'post',
      data: data,
      params: data
    })
  }

  destroyAdv(data) {
    return request({
      url: baseURL + `/${this.uri}/destroy`,
      method: 'post',
      data: data,
      params: data
    })
  }
  listTouchScreen(data) {
    return request({
      url: baseURL + `/adv/list_app_screen`,
      method: 'get',
      data: data,
      params: data,
      headers: {
        'authen': 'ajshshdcmchdhdhdhdhdhdhdhdhdhdhasg'
      }
    })
  }
  listAdvScreensShow(data) {
    return request({
      url: baseURL + `/adv/list_ads_screen_show`,
      method: 'get',
      data: data,
      params: data,
      headers: {
        'authen': 'ajshshdcmchdhdhdhdhdhdhdhdhdhdhasg'
      }
    })
  }
}

export { AdvResource as default }
