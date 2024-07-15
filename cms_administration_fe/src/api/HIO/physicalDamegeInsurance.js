import Resource from '@/api/resource'
import request from '@/utils/request'

const baseURL = 'https://api-bank-dev.vcallid.com/api/v1/material_covered'
const serviceUrl = process.env.VUE_APP_BASE_API + '/insurance-hio'

class PhysicalDamegeInsurance extends Resource {
  listCategoryProduct(data) {
    return request({
      url: baseURL + `/cms_list_category_material_covered`,
      method: 'GET',
      data: data,
      params: data
    })
  }

  listProdByCategory(data) {
    return request({
      url: baseURL + `/list_category_material_covered`,
      method: 'GET',
      data: data,
      params: data
    })
  }

  listProduct(data) {
    return request({
      url: baseURL + `/cms_list_product_material_covered`,
      method: 'POST',
      data: data,
      params: data
    })
  }

  createSubCategory(data) {
    return request({
      url: baseURL + `/cms_create_sub_category_material_coverd`,
      method: 'POST',
      data: data,
      params: data
    })
  }

  createCategory(data) {
    return request({
      url: baseURL + `/cms_create_category_material_coverd`,
      method: 'POST',
      data: data,
      params: data
    })
  }

  changeDisplay(data) {
    return request({
      url: baseURL + `/hidden_category_material_coverd`,
      method: 'GET',
      data: data,
      params: data
    })
  }

  listBill(data) {
    return request({
      url: baseURL + `/cms_list_masterial_coverd`,
      method: 'GET',
      data: data,
      params: data
    })
  }

  searchBill(data) {
    return request({
      url: baseURL + `/cms_search_material_covered`,
      method: 'POST',
      data: data,
      params: data
    })
  }

  createProduct(data) {
    return request({
      url: baseURL + `/cms_create_product_masterial_coverd`,
      method: 'POST',
      data: data,
      params: data
    })
  }

  updateProduct(data) {
    return request({
      url: baseURL + `/cms_update_product_material_covered`,
      method: 'POST',
      data: data,
      params: data
    })
  }

  listFacilitySale(data) {
    return request({
      url: baseURL + `/cms_list_facility_select_material_covered`,
      method: 'GET',
      params: data
    })
  }

  createHoleSale(data) {
    return request({
      url: baseURL + `/cms_add_hole_select_material_covered`,
      method: 'POST',
      data: data,
      params: data
    })
  }

  activeHoleSale(data) {
    return request({
      url: baseURL + `/cms_setting_hole_select_material_covered`,
      method: 'POST',
      data: data,
      params: data
    })
  }

  activeFacilitySale(data) {
    return request({
      url: baseURL + `/cms_setting_facility_select_material_covered`,
      method: 'POST',
      data: data,
      params: data
    })
  }

  listMaterialCovered(data) {
    return request({
      url: baseURL + `/cms_search_product_material_covered`,
      method: 'POST',
      data: data,
      params: data
    })
  }

  createMaterialCovered(data) {
    return request({
      url: baseURL + `/cms_create_masterial_coverd`,
      method: 'POST',
      data: data
    })
  }

  sendMailConfirmSaleToPVI(data, url) {
    return request({
      url: url,
      method: 'POST',
      data: data
    })
  }

  confirmSaleHIO(data) {
    return request({
      url: baseURL + `/cms_update_status_material_covered`,
      method: 'POST',
      data: data,
      params: data
    })
  }

  listMaterialOutsystem(data) {
    return request({
      url: `/order-material-outsystem/lists`,
      method: 'GET',
      params: data
    })
  }

  listLogCallbackPVI(data) {
    return request({
      url: `/order-material-outsystem/log-callback-pvi-material-covered`,
      method: 'GET',
      params: data
    })
  }

  searchAgency(data) {
    return request({
      url: `https://bussiness.vcallid.com/api/v1/search-agent-new`,
      method: 'GET',
      params: data
    })
  }

  addUserMaterial(data) {
    return request({
      url: baseURL + `/cms_add_user_material_covered`,
      method: 'POST',
      data: data
    })
  }

  updateSubCategory(data) {
    return request({
      url: baseURL + `/cms_update_sub_category`,
      method: 'POST',
      data: data,
      params: data
    })
  }

  updateCategory(data) {
    return request({
      url: baseURL + `/cms_update_category`,
      method: 'POST',
      data: data,
      params: data
    })
  }

  confirmSaleHIOOutSystem(data) {
    return request({
      url: baseURL + `/cms_update_order_material_outsystem`,
      method: 'POST',
      data: data,
      params: data
    })
  }

  createCodePayment(data) {
    return request({
      url: baseURL + `/cms_create_payment_material_covered`,
      method: 'POST',
      data: data
    })
  }

  removeUserFromOrder(data) {
    return request({
      url: baseURL + `/cms_remove_user_material_covered`,
      method: 'POST',
      data: data
    })
  }

  pushOrderToPVI(data) {
    return request({
      url: baseURL + `/cms_push_insurrance_pvi`,
      method: 'POST',
      data: data
    })
  }

  listUserInspector(data) {
    return request({
      url: baseURL + `/cms_list_user_inspector_material`,
      method: 'POST',
      data: data,
      params: data
    })
  }

  createUserInspector(data) {
    return request({
      url: baseURL + `/cms_setting_user_inspector_material_covered`,
      method: 'POST',
      data: data,
      params: data
    })
  }

  detailBillInsurance(data) {
    return request({
      url: baseURL + `/cms_view_detail_masterial_coverd`,
      method: 'POST',
      data: data,
      params: data
    })
  }

  getInfoPayment(data) {
    return request({
      url: baseURL + `/cms_get_info_payment_material_covered`,
      method: 'POST',
      data: data,
      params: data
    })
  }

  exportExcelBill(data) {
    return request({
      url: serviceUrl + `/export-excel-material`,
      method: 'GET',
      data: data,
      params: data
    })
  }
}

export { PhysicalDamegeInsurance as default }
