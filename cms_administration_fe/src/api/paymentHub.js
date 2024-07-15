import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = process.env.VUE_APP_URL_API_PAYMENT_HUB

class PaymentHubResource extends Resource {
  get_list_by_code(data) {
    return request({
      url: baseURL + `/get_list_by_code`,
      method: 'post',
      data
    })
  }
  create_general_bill_advance_money_outing(data) {
    return request({
      url: baseURL + `/create_general_bill_advance_money_outing`,
      method: 'post',
      data
    })
  }
  get_id_general_bill_detail(params) {
    return request({
      url: baseURL + `/get_id_general_bill_detail`,
      method: 'get',
      params
    })
  }
  update_general_bill_advance_money_outing(data) {
    return request({
      url: baseURL + `/update_general_bill_advance_money_outing`,
      method: 'post',
      data
    })
  }
  delete_general_bill_advance_money_outing(data) {
    return request({
      url: baseURL + `/delete_general_bill_advance_money_outing`,
      method: 'post',
      data
    })
  }
}

export { PaymentHubResource as default }
