import Resource from '@/api/resource'
import request from '@/utils/request'

class MoneyOutResource extends Resource {
  constructor() {
    super('money-out')
  }

  /**
   * list quản lý tiền chi
   * /money-out/list
   * @param query {limit, page, start_date, end_date, get_all, supplier_id, code_payment, bank_account_number}
   * @returns {*}
   * method: get
   */
  moneyOutList(query) {
    return request({
      url: `/${this.uri}/list`,
      method: 'get',
      params: query
    })
  }

  list(query) {
    return request({
      url: `/${this.uri}/list`,
      method: 'get',
      params: query
    })
  }
}

export { MoneyOutResource as default }
