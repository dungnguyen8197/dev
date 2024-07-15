import Resource from '@/api/resource'
import request from '@/utils/request'
// const baseURL = process.env.VUE_APP_BASE_API

class ControlBankResource extends Resource {
  constructor() {
    super('control-bank')
  }

  listNamA(data) {
    return request({
      url: `/${this.uri}/listNamA`,
      method: 'post',
      data
    })
  }

  exportNamA(query) {
    return request({
      url: `/${this.uri}/exportNamA`,
      method: 'get',
      params: query
    })
  }

  checkCodeBookingBeforePushNAB(data) {
    return request({
      url: `/${this.uri}/checkCodeBookingBeforePushNAB`,
      method: 'post',
      data
    })
  }

  sendOrderCardFree(data) {
    return request({
      url: `/${this.uri}/send-order-card-free`,
      method: 'post',
      data
    })
  }

  listSaCom(data) {
    return request({
      url: `/${this.uri}/list-sacom`,
      method: 'post',
      data
    })
  }
  totalMoneySaCom(data) {
    return request({
      url: `/${this.uri}/total-money-sacom`,
      method: 'post',
      data
    })
  }
  exportSaCom(query) {
    return request({
      url: `/${this.uri}/exportSacom`,
      method: 'get',
      params: query
    })
  }
  updateSacom(data, id) {
    return request({
      url: `/${this.uri}/update-sacom/${id}`,
      method: 'post',
      data
    })
  }
  confirmDone(data) {
    return request({
      url: `/${this.uri}/confirm-done`,
      method: 'post',
      data
    })
  }
  unConfirmDone(data, id) {
    return request({
      url: `/${this.uri}/un-confirm-done/${id}`,
      method: 'post',
      data
    })
  }
}

export { ControlBankResource as default }
