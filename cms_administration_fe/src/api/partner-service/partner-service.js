import Resource from '@/api/resource'
import request from '@/utils/request'

class PartnerServiceResource extends Resource {
  constructor() {
    super('partner-service-cms')
  }

  list(data) {
    return request({
      url: `/${this.uri}/list`,
      method: 'POST',
      params: data,
      data
    })
  }

  create_new_partner(data) {
    return request({
      url: `/${this.uri}/create-new-partner`,
      method: 'POST',
      params: {},
      data
    })
  }

  get_category(data) {
    return request({
      url: `/${this.uri}/get-category`,
      method: 'get',
      params: data,
      data
    })
  }

  update_partner(data) {
    return request({
      url: `/${this.uri}/update-partner`,
      method: 'POST',
      params: {},
      data
    })
  }

  remove_partner(data) {
    return request({
      url: `/${this.uri}/remove-partner`,
      method: 'POST',
      params: {},
      data
    })
  }

  create_new_voucher(data) {
    return request({
      url: `/${this.uri}/create-new-voucher`,
      method: 'POST',
      params: {},
      data
    })
  }

  voucher_management(data) {
    return request({
      url: `/${this.uri}/voucher-management`,
      method: 'POST',
      params: data,
      data
    })
  }

  partner_product_management(data) {
    return request({
      url: `/${this.uri}/partner-product-management`,
      method: 'POST',
      params: data,
      data
    })
  }

  add_voucher_to_user(data) {
    return request({
      url: `/${this.uri}/add-voucher-to-user`,
      method: 'POST',
      params: {},
      data
    })
  }

  cancel_voucher(data) {
    return request({
      url: `/${this.uri}/cancel-voucher`,
      method: 'POST',
      params: {},
      data
    })
  }

  lock_voucher(data) {
    return request({
      url: `/${this.uri}/lock-voucher`,
      method: 'POST',
      params: {},
      data
    })
  }

  get_user_own_voucher(data) {
    return request({
      url: `/${this.uri}/get-user-own-voucher`,
      method: 'POST',
      params: {},
      data
    })
  }

  remove_product(data) {
    return request({
      url: `/${this.uri}/remove-product`,
      method: 'POST',
      params: {},
      data
    })
  }

  create_partner_product(data) {
    return request({
      url: `/${this.uri}/create-partner-product`,
      method: 'POST',
      params: {},
      data
    })
  }

  update_partner_product(data) {
    return request({
      url: `/${this.uri}/update-partner-product`,
      method: 'POST',
      params: {},
      data
    })
  }

  check_code_exists(data, params) {
    return request({
      url: `/${this.uri}/check-code-exists`,
      method: 'GET',
      params: params,
      data
    })
  }

  ListStand(query) {
    return request({
      url: `/${this.uri}/list-stand`,
      method: 'get',
      params: query
    })
  }
}

export { PartnerServiceResource as default }
