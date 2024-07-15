import Resource from '@/api/resource'
import request from '@/utils/request'

class WapBankResource extends Resource {
  constructor() {
    super('wap-bank')
  }
  // bank
  list_bank(query) {
    return request({
      url: `/${this.uri}/list_bank`,
      method: 'GET',
      params: query
    })
  }
  store_bank(data) {
    return request({
      url: `/${this.uri}/store_bank`,
      method: 'POST',
      params: {},
      data
    })
  }
  update_bank(data, id) {
    return request({
      url: `/${this.uri}/update_bank/${id}`,
      method: 'POST',
      params: {},
      data
    })
  }

  // tag
  list_tag(query) {
    return request({
      url: `/${this.uri}/list_tag`,
      method: 'GET',
      params: query
    })
  }
  store_tag(data) {
    return request({
      url: `/${this.uri}/store_tag`,
      method: 'POST',
      params: {},
      data
    })
  }
  update_tag(data, id) {
    return request({
      url: `/${this.uri}/update_tag/${id}`,
      method: 'POST',
      params: {},
      data
    })
  }
  delete_tag(data, id) {
    return request({
      url: `/${this.uri}/delete_tag`,
      method: 'DELETE',
      params: {},
      data
    })
  }

  // package_sale
  list_package_sale(query) {
    return request({
      url: `/${this.uri}/list_package_sale`,
      method: 'GET',
      params: query
    })
  }
  store_package_sale(data) {
    return request({
      url: `/${this.uri}/store_package_sale`,
      method: 'POST',
      params: {},
      data
    })
  }
  update_package_sale(data, id) {
    return request({
      url: `/${this.uri}/update_package_sale/${id}`,
      method: 'POST',
      params: {},
      data
    })
  }

  // discount_price
  list_discount_price(query) {
    return request({
      url: `/${this.uri}/list_discount_price`,
      method: 'GET',
      params: query
    })
  }
  store_discount_price(data) {
    return request({
      url: `/${this.uri}/store_discount_price`,
      method: 'POST',
      params: {},
      data
    })
  }
  update_discount_price(data, id) {
    return request({
      url: `/${this.uri}/update_discount_price/${id}`,
      method: 'POST',
      params: {},
      data
    })
  }
  change_status_discount_price(data, id) {
    return request({
      url: `/${this.uri}/change_status_discount_price/${id}`,
      method: 'POST',
      params: {},
      data
    })
  }
  update_tag_discount_price(data, id) {
    return request({
      url: `/${this.uri}/update_tag_discount_price/${id}`,
      method: 'POST',
      params: {},
      data
    })
  }

  // hot_facility_home
  store_hot_facility_home(data) {
    return request({
      url: `/${this.uri}/store_hot_facility_home`,
      method: 'POST',
      params: {},
      data
    })
  }
}

export { WapBankResource as default }
