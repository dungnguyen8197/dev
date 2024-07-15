import Resource from '@/api/resource'
import request from '@/utils/request'
// const baseURL = process.env.VUE_APP_BASE_API
class StatisticResource extends Resource {
  constructor() {
    super('statistic')
  }

  list(query) {
    return request({
      url: `/${this.uri}/search?${query}`,
      method: 'get',
      data: query
    })
  }

  /**
   * sửa ngày công nợ
   * /statistic/change-day-debt
   * @param resource {booked_id, day_debt}
   * @returns {*}
   */
  editDebt(resource) {
    return request({
      url: `/${this.uri}/change-day-debt`,
      method: 'post',
      data: resource
    })
  }

  /**
   * chi tiet quan ly thu
   * /statistic/detail?pax_id=122681
   * @param pax_id
   * @returns {*}
   */
  detailStatistic(id) {
    return request({
      url: `/${this.uri}/detail?pax_id=${id}`,
      method: 'get'
    })
  }

  /**
   * sửa quản lý thu
   * /statistic/update
   * {
   *   "supplier":"15",
   *   "source_price" : "20000001",
   *   "revenue_price" : "2000001",
   *   "refund" : 1,
   *   "categories" : "hang muc 10",
   *   "pax_id" : "125971",
   *   "vga" : [59870,90315],
   *   "pax_booked_id": [7292, 7295],
   *   "type_purchase" : [1,1],
   *   "quantity_guest" : [14, 13],
   *   "agency": ["dai ly 2165", "dai ly 1"],
   *   "date_payment": ["2023-07-12", "2023-06-22"],
   *   "date_agent_payment" : ["2023-07-12", "2023-06-22"],
   *   "user_id_pay" : [90315],
   *   "surcharge_revenue": [4,1],
   *   "is_refund" : [1,0],
   *   "note" : null,
   *   "customer_invoice" : null,
   *   "type_post" : "1"
   * }
   * method: post
   */
  updateStatistic(resource) {
    return request({
      url: `/${this.uri}/update`,
      method: 'post',
      data: resource
    })
  }

  /**
   * import excel statistic
   * @method post
   * @body {file}
   */
  importFile(resource) {
    return request({
      headers: {
        'Content-Type': `multipart/form-data`
      },
      url: `/${this.uri}/import-change-date-agent-payment`,
      method: 'post',
      data: resource
    })
  }

  /**
   * tải file mẫu
   * /public/file-excel-example?headers=["header1", "header2", "header3"]
   * @method get
   * @param {headers}
   */
  downloadFile(query) {
    return request({
      url: `/public/file-excel-example?headers=${query}`,
      method: 'get'
    })
  }

  /**
   * Lay danh sach ma so thue
   * curl --location --request GET 'https://test-org.misa.com.vn/ms-org/v1/search?input=0300872315' \
   * --header 'project: VGS' \
   * --header 'apikey: 6PTi057KDbwDrNXAuvQCF5D2RIyOW4Cv' \
   * --header 'Content-Type: application/json' \
   * --data '{
   *     "input": "0300872315"
   * }'
   */
  searchPaxCode(query) {
    return request({
      header: 'project: VGS, apikey: 6PTi057KDbwDrNXAuvQCF5D2RIyOW4Cv',
      url: `https://test-org.misa.com.vn/ms-org/v1/search?input=${query}`,
      method: 'get'
    })
  }

  // lấy tổng tiền thu
  getSumRevenue(query) {
    return request({
      url: `/${this.uri}/get-total-money?${query}`,
      method: 'GET'
    })
  }

  // download file excel
  downloadExcel(query) {
    return request({
      url: `/${this.uri}/export-excel?${query}`,
      method: 'GET'
    })
  }

  dayDebt(query) {
    return request({
      url: `/${this.uri}/day-debt`,
      method: 'POST'
    })
  }
}

export { StatisticResource as default }
