import Resource from '@/api/resource'
import request from '@/utils/request'

const baseURL = process.env.VUE_APP_BASE_API
class ExpenseResource extends Resource {
  constructor() {
    super('expense')
  }

  /**
   * danh sách quản lý chi
   * /expense/search
   * @param query {code_payment, type_purchase, code_booking, start_date, end_date, limit, page, facility, admin, type_purchase, type_purchase_supplier, supplier_id}
   * @returns {*}
   * method: get
   */
  expenseList(query) {
    return request({
      url: `${baseURL}/${this.uri}/search`,
      method: 'get',
      params: query
    })
  }

  get_list_booking_create_code(query) {
    return request({
      url: `${baseURL}/${this.uri}/get_list_booking_create_code`,
      method: 'get',
      params: query
    })
  }
  /**
   * tao code chi
   * method: post
   * /expense/create-code-payment
   * body: {"list_pax_id": [126884, 127030], "supplier_id": 28, "amount_money": "22222222"}
   */
  createCodePayment(resource) {
    return request({
      url: `${baseURL}/${this.uri}/create-code-payment`,
      method: 'post',
      data: resource
    })
  }

  /**
   * gia nhap phu phi
   * /expense/update-booked
   * method: post
   * body: {
   *   "pax_id": 126884,
   *   "surcharge_entry_price" : [
   *         { "booked_id": 7307, "surcharge_entry_price": 5555}
   *     ]
   * }
   */
  inputPrice(resource) {
    return request({
      url: `${baseURL}/${this.uri}/update-booked`,
      method: 'post',
      data: resource
    })
  }

  /**
   * đối chiếu và xác nhận thanh toán
   * 1: đối chiếu, 0: xác nhận thanh toán
   * /expense/update-purchase-supplier
   * method: post
   * body: {"pax_id": 127076,"type": 1}
   */
  confirmExpense(resource) {
    return request({
      url: `${baseURL}/${this.uri}/update-purchase-supplier`,
      method: 'post',
      data: resource
    })
  }

  // download file excel
  downloadExcel(query) {
    return request({
      url: `/${this.uri}/export-excel?${query}`,
      method: 'GET'
    })
  }
}

export { ExpenseResource as default }
