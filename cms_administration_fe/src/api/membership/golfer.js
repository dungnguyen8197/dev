import Resource from '@/api/resource'
import request from '@/utils/request'

// const api = 'http://localhost:9999'

class ListGolferResource extends Resource {
  constructor() {
    super('list-golfer')
  }

  list(data, params) {
    return request({
      url: `${this.uri}/list-golfer`,
      method: 'get',
      data,
      params
    })
  }

  listCreateCodePayment(data, params) {
    return request({
      url: `${this.uri}/list-create-payment-upgrade`,
      method: 'post',
      data,
      params
    })
  }
  detailGolfer(data, params) {
    return request({
      url: `${this.uri}/detail-golfer`,
      method: 'get',
      data,
      params
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

  updateGolfer(data, params) {
    return request({
      url: `${this.uri}/update-golfer`,
      method: 'POST',
      data,
      params
    })
  }

  getOptionUpgradeAccount(query) {
    return request({
      url: `${this.uri}/get-option-upgrade-account`,
      method: 'get',
      params: query
    })
  }

  upgradeGolferSpecial(data) {
    return request({
      url: `${this.uri}/upgrade-golfer-special`,
      method: 'post',
      data
    })
  }
  listUpgradeGolferSpecial(data, params) {
    return request({
      url: `${this.uri}/history-upgrade-golfer-special`,
      method: 'post',
      data,
      params
    })
  }
  listUpgradeTypeAccount(query) {
    return request({
      url: `${this.uri}/list-upgrade-type-account`,
      method: 'get',
      params: query
    })
  }
  addUpgradeTypeAccount(data) {
    return request({
      url: `${this.uri}/add-upgrade-type-account`,
      method: 'post',
      data: data
    })
  }

  createNote(data) {
    return request({
      url: `${this.uri}/create-note`,
      method: 'post',
      data: data
    })
  }

  listNoteUser(query) {
    return request({
      url: `${this.uri}/list-note-by-user`,
      method: 'get',
      params: query
    })
  }

  historyTransactionUser(query) {
    return request({
      url: `${this.uri}/history-transaction-by-user`,
      method: 'get',
      params: query
    })
  }
  historyTransactionInDateUser(query) {
    return request({
      url: `${this.uri}/history-transaction-in-date-by-user`,
      method: 'get',
      params: query
    })
  }

  ListGolferInfinite(query) {
    return request({
      url: `${this.uri}/list-golfer-infinite`,
      method: 'get',
      params: query
    })
  }

  listDocument(query) {
    return request({
      url: `${this.uri}/list-document`,
      method: 'get',
      params: query
    })
  }
}

export { ListGolferResource as default }
