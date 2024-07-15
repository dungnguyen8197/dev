import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API

class UpgradeAccountResource extends Resource {
  getListHistoryUpgradeAccount(query) {
    return request({
      url: baseURL + `/upgrade/list`,
      method: 'GET',
      params: query
    })
  }
  submitUpgradeAccount(data) {
    return request({
      url: baseURL + `/upgrade/order-upgrade-account`,
      method: 'POST',
      data
    })
  }
  getListOrderUpgrade(query) {
    return request({
      url: baseURL + `/upgrade/list`,
      method: 'GET',
      params: query
    })
  }
  confirmUpgradeAccount(data) {
    return request({
      url: baseURL + `/upgrade/confirm`,
      method: 'POST',
      data
    })
  }
  onGetOptionUpgrade(query) {
    return request({
      url: baseURL + `/upgrade/get-option-upgrade-account`,
      method: 'GET',
      params: query
    })
  }
}
export { UpgradeAccountResource as default }
