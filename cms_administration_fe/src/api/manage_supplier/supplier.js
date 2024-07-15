import Resource from '@/api/resource'
import axios from '@/utils/axios'
// const baseURL = process.env.VUE_APP_BASE_API
const baseURL = process.env.VUE_APP_BASE_API_SUPPLIER

class supplierResource extends Resource {
  constructor() {
    super('')
  }
  /**
   * Duyet hop dong
   * @param {*} body
   * @returns
   */
  approve_contract(body) {
    return axios({
      url: baseURL + `/supplier/approve_contract`,
      method: 'post',
      data: body
    })
  }
  /**
   * Danh sach hop dong cho duyet
   * @returns
   */
  list_contact_not_approve() {
    return axios({
      url: baseURL + `/supplier/list_contact_not_approve`,
      method: 'get'
    })
  }
  /**
   * Thay doi trang thai hop dong
   * @param {*} body
   * @returns
   */
  contract_change_state(body) {
    return axios({
      url: baseURL + `/supplier/contract_change_state`,
      method: 'post',
      data: body
    })
  }
  /**
   * Xoa thong tin hop dong
   * @param {*} body
   * @returns
   */
  delete_contract(body) {
    return axios({
      url: baseURL + `/supplier/delete_contract`,
      method: 'post',
      data: body
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

  statistical_supplier_list(query) {
    return axios({
      url: baseURL + `/supplier/statistical_supplier_list`,
      method: 'get',
      params: query
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
  supplier_list_category(supplier_id) {
    return axios({
      url: baseURL + `/supplier/list_categories_supplier`,
      method: 'get',
      params: supplier_id
    })
  }
  update_cost(body) {
    return axios({
      url: baseURL + `/supplier/update_delivery_cost`,
      method: 'post',
      data: body
    })
  }
}

export { supplierResource as default }
