import Resource from '@/api/resource'
import request from '@/utils/request'
// const baseURL = process.env.VUE_APP_BASE_API
class MoneyInResource extends Resource {
  constructor() {
    super('money-in')
  }

  /**
   * list quản lý tiền thu
   * /money-in/list-money-in
   * @param query {limit, page, is_sale, admin_id, is_clear, transfer_content, code_booking, bank_account_number, note, source_type, amount_money, start_date, end_date, admin_id}
   * @returns {*}
   * method: get
   */
  moneyInList(query) {
    return request({
      url: `/${this.uri}/list-money-in`,
      method: 'get',
      params: query
    })
  }

  /**
   * tao quan ly tien thu
   * /money-in/store
   * @body {
   *     "date_transaction": "2023-07-19 00:00:00",
   *     "amount_money": "56546545",
   *     "bank_name": "nnn",
   *     "bank_account_number": "9201184888888",
   *     "note": "44",
   *     "transfer_content": "t43543r",
   *     "list_code_booking": "C7307,C7296,C7283",
   *     "check_list": "7307,7303,7281,7302"
   * }
   * method: post
   */
  storeMoneyIn(resource) {
    return request({
      url: `/${this.uri}/store`,
      method: 'post',
      data: resource
    })
  }
  /**
   * cap nhat quan ly tien thu
   * /money-in/update
   * @body {
   * "sale": null,
   * "admin": null,
   * "date_transaction": "2023-07-19 00:00:00",
   * "amount_money": "56546545",
   * "bank_name": "nnn",
   * "bank_account_number": "9201184888888",
   * "note": "44",
   * "transfer_content": "t43543r",
   * "list_code_booking": "C7307,C7296,C7283",
   * "check_list": "7307,7303,7281,7302"
   * }
   * @param id
   * method: post
   */
  updateMoneyIn(resource, id) {
    return request({
      url: `/${this.uri}/update?id=${id}`,
      method: 'post',
      data: resource
    })
  }

  /**
   * cap nhat tt clear
   * /money-in/confirm-clear?id=222
   * @param id
   * @body {
   *     "is_clear": 1,
   *     "admin_id": 60
   * }
   * method: post
   */
  confirmClear(resource, id) {
    return request({
      url: `/${this.uri}/confirm-clear?id=${id}`,
      method: 'post',
      data: resource
    })
  }

  /**
   * api xac nhan
   * /money-in/confirm-done?id=213
   * @body {
   *     "is_done": "1",
   *     "time_done": "2022-02-03 07:33:00"
   * }
   * @param id
   * method post
   */
  confirmDone(resource, id) {
    return request({
      url: `/${this.uri}/confirm-done?id=${id}`,
      method: 'post',
      data: resource
    })
  }

  /**
   * api nhan xu ly
   * /money-in/confirm-process?id=213
   * @param id
   * @body {"admin_id": 60}
   * @method post
   */
  confirmProcess(resource, id) {
    return request({
      url: `/${this.uri}/confirm-process?id=${id}`,
      method: 'post',
      data: resource
    })
  }

  /**
   * api bo nhan xu ly
   * /money-in/un-confirm-process?id=213
   * @param id
   * @method post
   */
  confirmUnProcess(id) {
    return request({
      url: `/${this.uri}/un-confirm-process?id=${id}`,
      method: 'post'
    })
  }

  exportExcel(query) {
    return request({
      url: `/${this.uri}/export-excel`,
      method: 'get',
      params: query
    })
  }
}

export { MoneyInResource as default }
