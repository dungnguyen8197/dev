import Resource from '@/api/resource'
import axios from '@/utils/axios'
const baseURL = process.env.VUE_APP_BASE_API_SUPPLIER
// const baseURL = 'http://192.168.1.4:3000/api/public'
class ManageRevenueResource extends Resource {
  constructor() {
    super('')
  }
  listRevenue(query = { page: 1, limit: 10 }) {
    return axios({
      url: baseURL + `/revenue/list_cms`,
      method: 'get',
      params: query
    })
  }
  listSale() {
    return axios({
      url: baseURL + `/account/list_telesale`,
      method: 'get'
    })
  }
  listOrder(query = { page: 1, limit: 10 }) {
    return axios({
      url: baseURL + `/order/list`,
      method: 'get',
      params: query
    })
  }
  listStatisticalOrder(query = { page: 1, limit: 10 }) {
    return axios({
      url: baseURL + `/statistical/get_list_products_order`,
      method: 'get',
      params: query
    })
  }
  exportExcelRevenue(query) {
    return axios({
      url: baseURL + `/revenue/export_for_cms`,
      method: 'get',
      params: query
    })
  }
  voucherDetail(query) {
    return axios({
      url: baseURL + `/voucher/detail/`,
      method: 'get',
      params: query
    })
  }
}

export { ManageRevenueResource as default }
