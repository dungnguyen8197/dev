import Resource from '@/api/resource'
import request from '@/utils/request'

class PackageTeeResource extends Resource {
  constructor() {
    super('package-tee')
  }

  list(query) {
    return request({
      url: `/${this.uri}/list`,
      method: 'GET',
      params: query
    })
  }
  store(data) {
    return request({
      url: `/${this.uri}/store`,
      method: 'POST',
      params: {},
      data
    })
  }
  update(data) {
    return request({
      url: `/${this.uri}/update`,
      method: 'POST',
      params: {},
      data
    })
  }
  sell_pack(data) {
    return request({
      url: `/${this.uri}/sell_pack`,
      method: 'POST',
      params: {},
      data
    })
  }
  list_date_sell(data) {
    return request({
      url: `/${this.uri}/list_date_sell`,
      method: 'POST',
      params: {},
      data
    })
  }

  detail_manager_source_price(data) {
    return request({
      url: `/${this.uri}/detail_manager_source_price`,
      method: 'POST',
      params: {},
      data
    })
  }

  update_manager_source_price(data) {
    return request({
      url: `/${this.uri}/update_manager_source_price`,
      method: 'POST',
      params: {},
      data
    })
  }

  clock_package(data) {
    return request({
      url: `/${this.uri}/clock_package`,
      method: 'POST',
      params: {},
      data
    })
  }

  statistic_list_pack_trade_by_day(query) {
    return request({
      url: `/${this.uri}/statistic_list_pack_trade_by_day`,
      method: 'GET',
      params: query
    })
  }

  erase_pack(data) {
    return request({
      url: `/${this.uri}/erase_pack`,
      method: 'POST',
      params: {},
      data
    })
  }

  detail_price_tee_by_agency(data) {
    return request({
      url: `/${this.uri}/detail_price_tee_by_agency`,
      method: 'POST',
      data
    })
  }
  block_package_tee(data, id) {
    return request({
      url: `/${this.uri}/update_package_tee/${id}`,
      method: 'POST',
      data
    })
  }
  exportPackage(data) {
    return request({
      url: `/${this.uri}/export_package_tee`,
      method: 'POST',
      data
    })
  }
}

export { PackageTeeResource as default }
