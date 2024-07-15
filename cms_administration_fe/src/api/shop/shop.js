import Resource from '@/api/resource'
import axios from '@/utils/axios'
const baseURL = process.env.VUE_APP_BASE_API_SUPPLIER

class ShopResource extends Resource {
  constructor() {
    super('api/public/shop')
  }
  shopList(query) {
    return axios({
      url: baseURL + `/list`,
      method: 'get',
      params: query
    })
  }
  shopDetail(id) {
    return axios({
      url: baseURL + `/detail/${id}`,
      method: 'get'
    })
  }
  detailShop(id) {
    return axios({
      url: baseURL + `shop/detail_cms_v2?id=${id}`,
      method: 'get'
    })
  }
  storeShop(resource) {
    return axios({
      url: baseURL + `/create`,
      method: 'post',
      data: resource
    })
  }
  updateShop(resource) {
    return axios({
      url: baseURL + `/update`,
      method: 'post',
      data: resource
    })
  }
  deleteShop(id) {
    return axios({
      url: baseURL + `/delete/${id}`,
      method: 'get'
    })
  }
  getProvinceList() {
    return axios({
      url: baseURL + `/address_ship/viettel_list_province_or_city`,
      method: 'get'
    })
  }
  getDistrictList(query) {
    return axios({
      url: baseURL + `/address_ship/viettel_list_district`,
      method: 'get',
      params: query
    })
  }
  getWardsList(query) {
    return axios({
      url: baseURL + `/address_ship/viettel_list_wards`,
      method: 'get',
      params: query
    })
  }
  getFilterList(query) {
    return axios({
      url: baseURL + `/shop/search`,
      method: 'get',
      params: query
    })
  }
  listShopOption(query) {
    return axios({
      url: baseURL + `api/public/shop/list_option`,
      method: 'get',
      params: query
    })
  }
  shopListOption(query) {
    return axios({
      url: baseURL + `/list_option`,
      method: 'get',
      params: query
    })
  }
  /**
   * Lay thong tin ten shop
   * @param {*} shop_id
   * @returns
   */
  get_name_shop(shop_id) {
    return axios({
      url: baseURL + `/get_name_shop&shop_id=${shop_id}`,
      method: 'get'
    })
  }
}

export { ShopResource as default }
