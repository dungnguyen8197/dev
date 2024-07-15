import Resource from '@/api/resource'
import axios from '@/utils/axios'
// const baseURL = process.env.VUE_APP_BASE_API
const baseURL = process.env.VUE_APP_BASE_API_SUPPLIER

class ShopResource extends Resource {
  constructor() {
    super('')
  }
  /**
   * Lay thong tin ten shop
   * @param {*} shop_id
   * @returns
   */
  get_name_shop(shop_id) {
    return axios({
      url: baseURL + `/shop/get_name_shop?shop_id=${shop_id}`,
      method: 'get'
    })
  }
  statistical_supplier_list(query) {
    return axios({
      url: baseURL + `/supplier/statistical_supplier_list`,
      method: 'get',
      params: query
    })
  }
  list_statistical_supplier(query) {
    return axios({
      url: baseURL + `/statistical/list_statistical_supplier`,
      method: 'get',
      params: query
    })
  }
  list_statistical_supplier_for_all(query) {
    return axios({
      url: baseURL + `/statistical/list_statistical_supplier_for_all`,
      method: 'get',
      params: query
    })
  }
  list_product_order(query) {
    return axios({
      url: baseURL + `/statistical/get_list_products_order`,
      method: 'get',
      params: query
    })
  }
  export_statistical(query) {
    return axios({
      url: baseURL + `/statistical/export_statistial`,
      method: 'get',
      params: query
    })
  }
  /**
   * Lay thong ke o home
   * @returns
   */
  statistical_home(shop_id = 0) {
    return axios({
      url: baseURL + `/supplier/statistical_home?shop_id=${shop_id}`,
      method: 'get'
    })
  }
  /**
   * bieu do 7 ngay gan nhat
   * @returns
   */
  statistical_line_chart_week(shop_id = 0, chanel_id = 1) {
    return axios(({
      url: baseURL + `/supplier/statistical_line_chart?shop_id=${shop_id}&chanel=${chanel_id}`,
      method: 'get'
    }))
  }
  /**
   * Thong ke theo doanh thu
   * @param {*} query
   * @returns
   */
  statistical_revenue(query) {
    return axios({
      url: baseURL + `/supplier/statistical_revenue`,
      method: 'get',
      params: query
    })
  }
  shopList(query) {
    return axios({
      url: baseURL + `/shop/list`,
      method: 'get',
      params: query
    })
  }
}

export { ShopResource as default }
