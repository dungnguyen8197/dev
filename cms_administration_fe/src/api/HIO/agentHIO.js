import Resource from '@/api/resource'
import request from '@/utils/request'
import { getRefreshToken, getToken } from '@/utils/auth'
// import { getToken, setToken } from '@/utils/auth'

// const api = 'http://localhost:9999'
class AgentHIOResource extends Resource {
  constructor() {
    super('sport-agent')
  }

  list(query) {
    return request({
      url: `${this.uri}/all`,
      method: 'get',
      params: query
    })
  }
  remove(id) {
    return request({
      url: `${this.uri}/remove/${id}`,
      method: 'get'
    })
  }

  create(data) {
    return request({
      url: `${this.uri}/create`,
      method: 'post',
      data
    })
  }

  updateStatus(data, id) {
    return request({
      url: `${this.uri}/update-status/${id}`,
      method: 'post',
      data: data
    })
  }

  updateStatusPayment(data, id) {
    return request({
      url: `${this.uri}/update-status-payment/${id}`,
      method: 'post',
      data: data
    })
  }

  update(data, id) {
    return request({
      url: `${this.uri}/update/${id}`,
      method: 'post',
      data: data
    })
  }

  searchGolfer(query, data) {
    return request({
      url: `${this.uri}/search-golfer`,
      method: 'POST',
      data,
      params: query
    })
  }

  exportData(data) {
    request.defaults.responseType = 'blob'
    return request({
      url: `${this.uri}/export-agent`,
      method: 'POST',
      data
    })
  }
  listInsurance(data, params) {
    return request({
      url: `${this.uri}/list-insurance`,
      method: 'get',
      data: data,
      params
    })
  }
  listRevenueAgent(query) {
    return request({
      url: `${this.uri}/list-revenue-agent`,
      method: 'get',
      params: query,
      headers: {
        Authorization: `Bearer ` + getToken(),
        'X-Token': getRefreshToken(),
        'Access-Control-Allow-Origin': '*' // Allow CORS
        // account_manager: getAdmin()
      }
    })
  }

  listTotalInsuranceByAgent(query) {
    return request({
      url: `${this.uri}/list-total-insurance-by-agent`,
      method: 'get',
      params: query
    })
  }

  listDebitInsuranceByAgent(query) {
    return request({
      url: `${this.uri}/list-debit-insurance-by-agent`,
      method: 'get',
      params: query
    })
  }

  listDebitInsuranceByAgentCode(query) {
    return request({
      url: `${this.uri}/list-debit-insurance-by-agent-code`,
      method: 'get',
      params: query
    })
  }
  listOutOfDateInsuranceByAgent(query) {
    return request({
      url: `${this.uri}/list-out-of-date-insurance`,
      method: 'get',
      params: query
    })
  }

  exportRevenueAgent(query) {
    return request({
      url: `${this.uri}/export-revenue-agent`,
      method: 'get',
      params: query
    })
  }

  onRemoveFile(query) {
    return request({
      url: `${this.uri}/public-remove-file`,
      method: 'get',
      params: query
    })
  }

  searchAgent(data) {
    return request({
      url: `${this.uri}/search-agent`,
      method: 'post',
      data: data
    })
  }
  createCodePayment(resource) {
    return request({
      url: `${this.uri}/create-code-payment`,
      method: 'post',
      data: resource
    })
  }

  searchAgentNew(query) {
    return request({
      url: `${this.uri}/search-agent-new`,
      method: 'get',
      params: query
    })
  }
  searchSaleNew(query) {
    return request({
      url: `${this.uri}/search-sale-cms`,
      method: 'get',
      params: query
    })
  }
  certificateItem(query) {
    return request({
      url: `${this.uri}/certificate-item`,
      method: 'get',
      params: query
    })
  }
}

export { AgentHIOResource as default }
