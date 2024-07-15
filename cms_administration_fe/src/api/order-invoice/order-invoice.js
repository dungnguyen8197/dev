import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API

class OrderInvoiceResource extends Resource {
  constructor() {
    super('order-invoice')
  }

  listOrder(query) {
    return request({
      url: baseURL + `/${this.uri}/list`,
      method: 'get',
      params: query
    })
  }
  storeOrder(data) {
    return request({
      url: baseURL + `/${this.uri}/store`,
      method: 'post',
      data
    })
  }
  updateOrder(data, id) {
    return request({
      url: baseURL + `/${this.uri}/update/${id}`,
      method: 'post',
      data: data
    })
  }
  exportExcel(query) {
    return request({
      url: baseURL + `/${this.uri}/export-excel`,
      method: 'get',
      params: query
    })
  }
  cancelOrder(data) {
    return request({
      url: baseURL + `/${this.uri}/cancel-order`,
      method: 'post',
      data
    })
  }
  changeStatusExportVoucher(data) {
    return request({
      url: baseURL + `/${this.uri}/change-status-export-voucher`,
      method: 'post',
      data
    })
  }
}

export { OrderInvoiceResource as default }
