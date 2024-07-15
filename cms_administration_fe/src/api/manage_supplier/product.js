import Resource from '@/api/resource'
import axios from '@/utils/axios'
// const baseURL = process.env.VUE_APP_BASE_API
const baseURL = process.env.VUE_APP_BASE_API_SUPPLIER

class ProductResource extends Resource {
  constructor() {
    super('product')
  }
  getExportList(query) {
    return axios({
      url: baseURL + `/${this.uri}/export_data`,
      method: 'get',
      params: query
    })
  }
  deleteProduct(id) {
    return axios({
      url: baseURL + `/${this.uri}/delete/${id}`,
      method: 'get'
    })
  }
  listProduct(query) {
    return axios({
      url: baseURL + `/${this.uri}/list_cms`,
      method: 'get',
      params: query
    })
  }
  listShopOption(query) {
    return axios({
      url: baseURL + `/shop/list_option`,
      method: 'get',
      params: query
    })
  }
  listCategory(query) {
    return axios({
      url: baseURL + `/category/list_cms_for_option`,
      method: 'get',
      params: query
    })
  }
  listTrademarkOption(query) {
    return axios({
      url: baseURL + `/trademark/list_option`,
      method: 'get',
      params: query
    })
  }
  createQuantity(resource) {
    return axios({
      url: baseURL + `/product/create_quantity`,
      method: 'post',
      data: resource
    })
  }
  /**
   * update số lượng sp
   * @param resource
   * @returns {AxiosPromise}
   */
  updateQuantity(resource) {
    return axios({
      url: baseURL + `/product/update_quantity`,
      method: 'post',
      data: resource
    })
  }
  deleteParam(id) {
    return axios({
      url: baseURL + `/product/delete_params_cms`,
      method: 'post',
      data: { id }
    })
  }
  /**
   * api cập nhật số lượng tồn kho
   * method: POST
   * @param body: {path_exel}
   * @returns {AxiosPromise}
   */
  importFileInventory(body) {
    return axios({
      url: baseURL + `/product/update_quantity_from_excel`,
      method: 'post',
      data: body
    })
  }
  importFileProduct(data) {
    return axios({
      url: baseURL + `/product/save`,
      method: 'post',
      data
    })
  }
  statusProduct(id) {
    return axios({
      url: baseURL + `/product/status/${id}`,
      method: 'get'
    })
  }
  DetailProduct(id) {
    return axios({
      url: baseURL + `/product/detail_cms/${id}`,
      method: 'get'
    })
  }
  storeProduct(resource) {
    return axios({
      url: baseURL + `/product/create`,
      method: 'post',
      data: resource
    })
  }
  /**
   * sửa sp
   * @param resource
   * @returns {*}
   */
  updateProduct(resource) {
    return axios({
      url: baseURL + `/product/update_cms`,
      method: 'post',
      data: resource
    })
  }
  Detail(id) {
    return axios({
      url: baseURL + `/product/detail_cms_v1?id=${id}`,
      method: 'get'
    })
  }
  tagListOption(query) {
    return axios({
      url: baseURL + `/tags/list_option`,
      method: 'get',
      params: query
    })
  }
}

export { ProductResource as default }
