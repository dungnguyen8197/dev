import Resource from '@/api/resource'
import request from '@/utils/request'

class InsuranceApi extends Resource {
  constructor() {
    super('insurance-hio')
  }

  listInsurance(query) {
    return request({
      url: `${this.uri}/list-insurance`,
      method: 'get',
      params: query
    })
  }

  changeStatusCustomerPayAll(data) {
    return request({
      url: `${this.uri}/change-status-customer-pay-all-cms`,
      method: 'post',
      data: data
    })
  }

  sendRequestInsurancePvi(data) {
    return request({
      url: `${this.uri}/send-request-pvi-cms`,
      method: 'post',
      data: data
    })
  }

  listQR(query) {
    return request({
      url: `${this.uri}/list-qr`,
      method: 'get',
      params: query
    })
  }

  listHolePar3(query) {
    return request({
      url: `${this.uri}/list-hole-par-3`,
      method: 'get',
      params: query
    })
  }
  createQR(data) {
    return request({
      url: `${this.uri}/create-qr`,
      method: 'post',
      data: data
    })
  }
  updateStatusQr(data, id) {
    return request({
      url: `${this.uri}/update-status-qr/${id}`,
      method: 'post',
      data: data
    })
  }

  listInsuranceS(query) {
    return request({
      url: `${this.uri}/list-insurance-s`,
      method: 'get',
      params: query
    })
  }

  listContract(query) {
    return request({
      url: `${this.uri}/list-contract`,
      method: 'get',
      params: query
    })
  }

  storeContract(data) {
    return request({
      url: `${this.uri}/store-contract`,
      method: 'post',
      data: data
    })
  }
  updateContract(data, id) {
    return request({
      url: `${this.uri}/update-contract/${id}`,
      method: 'post',
      data: data
    })
  }

  searchContract(data) {
    return request({
      url: `${this.uri}/search-contract`,
      method: 'post',
      data: data
    })
  }

  searchContractCode(data) {
    return request({
      url: `${this.uri}/search-contract-code`,
      method: 'post',
      data: data
    })
  }

  updateStatusContract(data, id) {
    return request({
      url: `${this.uri}/update-status-contract/${id}`,
      method: 'post',
      data: data
    })
  }

  revenueContract(query) {
    return request({
      url: `${this.uri}/revenue-contract`,
      method: 'get',
      params: query
    })
  }

  exportRevenueContract(query) {
    return request({
      url: `${this.uri}/export-revenue-contract`,
      method: 'get',
      params: query
    })
  }

  exportListInsuranceS(query) {
    return request({
      url: `${this.uri}/export-list-insurance-s`,
      method: 'get',
      params: query
    })
  }

  listMemberInsurance(query) {
    return request({
      url: `${this.uri}/list-member-s`,
      method: 'get',
      params: query
    })
  }

  listInsuranceDialog(query) {
    return request({
      url: `${this.uri}/list-insurance-dialog`,
      method: 'get',
      params: query
    })
  }
  exportListInsuranceDialog(query) {
    return request({
      url: `${this.uri}/export-list-insurance-dialog`,
      method: 'get',
      params: query
    })
  }

  cms_list_masterial_coverd(query) {
    return request({
      url: `${this.uri}/cms_list_masterial_coverd`,
      method: 'get',
      params: query
    })
  }
}

export { InsuranceApi as default }
