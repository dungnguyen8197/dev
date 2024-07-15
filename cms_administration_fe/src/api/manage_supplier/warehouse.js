import Resource from '@/api/resource'
import axios from '@/utils/axios'
// const baseURL = 'http://192.168.1.6:3000/api/public'
// const baseURL = 'http://10.10.1.68:3000/api/public'
const baseURL = process.env.VUE_APP_BASE_API_SUPPLIER

class WarehouseResource extends Resource {
  constructor() {
    super('')
  }
  /**
   * Lay thong tin ten shop
   * @param {*} shop_id
   * @returns
   */
  create_note(data) {
    return axios({
      url: baseURL + `/warehouse/create`,
      method: 'post',
      data: data
    })
  }
  list_shop_all() {
    return axios({
      url: baseURL + `/shop/list_option`,
      method: 'get'
    })
  }
  list_product(query) {
    return axios({
      url: baseURL + `/product/list_cms`,
      method: 'get',
      params: query
    })
  }
  list_warehouse_received_note(query) {
    return axios({
      url: baseURL + `/warehouse/list_phieu_nhap_xuat`,
      method: 'get',
      params: query
    })
  }
  edit_warehouse_note(data) {
    return axios({
      url: baseURL + `/warehouse/update_phieu`,
      method: 'post',
      data: data
    })
  }
  delete_warehouse_note(data) {
    return axios({
      url: baseURL + `/warehouse/cancel_phieu_xuat_nhap`,
      method: 'post',
      data: data
    })
  }
  detail_warehouse_note(query) {
    return axios({
      url: baseURL + `/warehouse/detail_phieu_xuat_nhap`,
      method: 'get',
      params: query
    })
  }
  detail_warehouse_list_product(query) {
    return axios({
      url: baseURL + `/warehouse/detail_list_product`,
      method: 'get',
      params: query
    })
  }
  detail_warehouse_product_statistical(query) {
    return axios({
      url: baseURL + `/warehouse/product_statistical`,
      method: 'get',
      params: query
    })
  }
  warehouse_tatistical(query) {
    return axios({
      url: baseURL + `/warehouse/warehouse_statistical`,
      method: 'get',
      params: query
    })
  }
  add_product_to_warehouse(data) {
    return axios({
      url: baseURL + `/warehouse/add_product`,
      method: 'post',
      data: data
    })
  }
  edit_product_to_warehouse(query, data) {
    return axios({
      url: baseURL + `/warehouse/update_product`,
      method: 'post',
      params: query,
      data: data
    })
  }
  delete_product_to_warehouse(query) {
    return axios({
      url: baseURL + `/warehouse/delete_product`,
      method: 'post',
      params: query
    })
  }
  export_warehouse(query) {
    return axios({
      url: baseURL + `/warehouse/export_warehouse_statistical`,
      method: 'get',
      params: query
    })
  }
}

export { WarehouseResource as default }
