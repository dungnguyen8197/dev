import Resource from '@/api/resource'
import axios from '@/utils/axios'
import { getAcountInfo } from '@/utils/auth'
const account = getAcountInfo()
// const baseURL = process.env.VUE_APP_BASE_API
const baseURL = process.env.VUE_APP_BASE_API_SUPPLIER
const version_cms = 1

class ManageSupplierResource extends Resource {
  constructor() {
    super('')
  }

  getVerify() {
    if (account && account.id) {
      // return `uid=${account.id}&token=${getToken()}&cms=${version_cms}`
      return `uid=${account.id}&cms=${version_cms}`
    } else {
      return `cms=${version_cms}`
    }
  }

  listMenu(data = { email: 'demo@gmail.com', name: 'demo' }) {
    return axios({
      baseURL: process.env.VUE_APP_BASE_API_SUPPLIER,
      url: `${this.uri}/supplier/list_supplier_menu_item`,
      method: 'post',
      data: data
    })
  }
  listBrand(query = { page: 1, limit: 10 }) {
    return axios({
      baseURL: process.env.VUE_APP_BASE_API_SUPPLIER,
      url: `${this.uri}/trademark/list`,
      method: 'get',
      params: query
    })
  }
  ListSupplier(query) {
    return axios({
      url: baseURL + `/shop/list`,
      method: 'get',
      params: query
    })
  }
  uploadImage(data) {
    return axios({
      url: baseURL + `/post_cdn`,
      method: 'post',
      data: data
    })
  }
  addBrand(data) {
    return axios({
      url: baseURL + `/trademark/create`,
      method: 'post',
      data: data
    })
  }
  editBrand(data) {
    return axios({
      url: baseURL + `/trademark/update`,
      method: 'post',
      data: data
    })
  }
  getProvinceList() {
    return axios({
      url: baseURL + `/address_ship/viettel_list_province_or_city`,
      method: 'get'
    })
  }
  getWardsList(query) {
    return axios({
      url: baseURL + `/address_ship/viettel_list_wards`,
      method: 'get',
      params: query
    })
  }
  getDistrictList(query) {
    return axios({
      url: baseURL + `/address_ship/viettel_list_district`,
      method: 'get',
      params: query
    })
  }
  get_bussiness_type() {
    return axios({
      url: baseURL + `/supplier/get_bussiness_type`,
      method: 'get'
    })
  }
  /**
   * Tạo mới thông tin nhà cung cấp
   * @param {*} body
   * @returns
   */
  create_general_supplier(body) {
    return axios({
      url: baseURL + `/supplier/create_general_supplier`,
      method: 'post',
      data: body
    })
  }
  /**
   * Chi tiet nha cung cap
   * @param {*} id
   * @returns
   */
  get_supplier_info(id) {
    return axios({
      url: baseURL + `/get_supplier_info?id=${id}`,
      method: 'get'
    })
  }
  upload_discount(body) {
    return axios({
      url: baseURL + `/supplier/upload_discount`,
      method: 'post',
      data: body
    })
  }
  detele_discount(body) {
    return axios({
      url: baseURL + `/supplier/detele_discount`,
      method: 'post',
      data: body
    })
  }
  list_contract_active(shop_id = 0) {
    return axios({
      url: baseURL + `/supplier/list_contract_active?shop_id=${shop_id}`,
      method: 'get'
    })
  }
  add_new_bank_account(body) {
    return axios({
      url: baseURL + `/add_new_bank_account`,
      method: 'post',
      data: body
    })
  }
  list_signer() {
    return axios({
      url: baseURL + `/supplier/list_signer`,
      method: 'get'
    })
  }
  update_contract(body) {
    return axios({
      url: baseURL + `/supplier/update_contract`,
      method: 'post',
      data: body
    })
  }
  create_new_exeprt(body) {
    return axios({
      url: baseURL + `create_new_exeprt`,
      method: 'post',
      data: body
    })
  }
  delete_exeprt(body) {
    return axios({
      url: baseURL + `/delete_exeprt`,
      method: 'post',
      data: body
    })
  }
  list_categories() {
    return axios({
      url: baseURL + `/supplier/list_categories`,
      method: 'get'
    })
  }
  deleteShop(id) {
    return axios({
      url: baseURL + `/shop/delete/${id}`,
      method: 'get'
    })
  }
  detail(id) {
    return axios({
      url: baseURL + `/supplier/detail_supplier?id=${id}`,
      method: 'get'
    })
  }
  get_person_contact(shop_id) {
    return axios({
      url: baseURL + `/supplier/get_person_contact?shop_id=${shop_id}`,
      method: 'get'
    })
  }
  get_person_representative(id) {
    return axios({
      url: baseURL + `/supplier/get_person_representative?id=${id}`,
      method: 'get'
    })
  }
  update_supplier_info(body) {
    return axios({
      url: baseURL + `/supplier/update_supplier_info`,
      method: 'post',
      data: body
    })
  }
  /**
   * Tao thong tin nguoi dai dien
   * @param {*} body
   */
  create_person_representative(body) {
    return axios({
      url: baseURL + `/supplier/create_person_representative`,
      method: 'post',
      data: body
    })
  }
  update_representative_person(body) {
    return axios({
      url: baseURL + `/supplier/update_representative_person`,
      method: 'post',
      data: body
    })
  }
  create_person_contact(body) {
    return axios({
      url: baseURL + `/supplier/create_person_contact`,
      method: 'post',
      data: body
    })
  }
  update_contact_person(body) {
    return axios({
      url: baseURL + `/supplier/update_contact_person`,
      method: 'post',
      data: body
    })
  }
  create_pickup_address(body) {
    return axios({
      url: baseURL + `/supplier/create_pickup_address`,
      method: 'post',
      data: body
    })
  }
  update_pickup_address(body) {
    return axios({
      url: baseURL + `/supplier/update_pickup_address`,
      method: 'post',
      data: body
    })
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
  reject_contract(body) {
    return axios({
      url: baseURL + `/supplier/reject_contract`,
      method: 'post',
      data: body
    })
  }
  /**
   * Tạo thông tin hợp đồng
   * @param {*} body
   * @returns
   */
  create_contract(body) {
    return axios({
      url: baseURL + `/supplier/create_contract`,
      method: 'post',
      data: body
    })
  }
  /**
   * Chi tiet hop dong
   * @param {*} id
   * @returns
   */
  detail_contract(id) {
    return axios({
      url: baseURL + `/supplier/detail_contract?id=${id}`,
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
  // API LIEN QUAN HANG MUC
  listCategory(query) {
    return axios({
      url: `${baseURL}/category/list_cms_2?${this.getVerify()}`,
      method: 'get',
      params: query
    })
  }
  storeCategory(resource) {
    return axios({
      url: `${baseURL}/category/create?${this.getVerify()}`,
      method: 'post',
      data: resource
    })
  }
  updateCategory(resource) {
    return axios({
      url: `${baseURL}/category/update?${this.getVerify()}`,
      method: 'post',
      data: resource
    })
  }
  deleteCategory(id) {
    return axios({
      url: `${baseURL}/category/delete/${id}?${this.getVerify()}`,
      method: 'get'
    })
  }

  /** thêm sản phẩm vào danh mục
   * @body:{category_id,list_product}
   * @post
   */
  storeProductCategory(resource) {
    return axios({
      url: `${baseURL}/category/add_list_product?${this.getVerify()}`,
      method: 'post',
      data: resource
    })
  }
  // END API HANG MUC
}

export { ManageSupplierResource as default }
