import Resource from '@/api/resource'
import request from '@/utils/request'

class VoucherResource extends Resource {
  constructor() {
    super('voucher')
  }

  list(data) {
    return request({
      url: `/${this.uri}/list`,
      method: 'POST',
      params: {},
      data
    })
  }

  list_provider(data, params) {
    return request({
      url: `/${this.uri}/list-provider`,
      method: 'GET',
      params: params,
      data
    })
  }

  get_screen_using(data, params) {
    return request({
      url: `/${this.uri}/get-screen-using`,
      method: 'GET',
      params: params,
      data
    })
  }

  get_list_bank(data, params) {
    return request({
      url: `https://api.vietqr.io/v2/banks`,
      method: 'GET',
      params: params,
      data
    })
  }

  create_new_voucher(data, params) {
    return request({
      url: `/${this.uri}/create-new-voucher`,
      method: 'post',
      params: {},
      data
    })
  }

  cancel_voucher(data, params) {
    return request({
      url: `/${this.uri}/cancel-voucher`,
      method: 'post',
      params: {},
      data
    })
  }

  clock_voucher(data, params) {
    return request({
      url: `/${this.uri}/lock-voucher`,
      method: 'post',
      params: {},
      data
    })
  }

  add_voucher_to_user(data, params) {
    return request({
      url: `/${this.uri}/add-voucher-to-user`,
      method: 'post',
      params: {},
      data
    })
  }

  get_user_own_voucher(data, params) {
    return request({
      url: `/${this.uri}/get-user-own-voucher`,
      method: 'post',
      params: {},
      data
    })
  }
}

export { VoucherResource as default }
