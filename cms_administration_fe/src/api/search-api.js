import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API
class SearchResource extends Resource {
  constructor() {
    super('search')
  }

  searchFacility(data) {
    return request({
      url: `${baseURL}/${this.uri}/search-facility`,
      method: 'post',
      data: data
    })
  }

  searchAdmin(data) {
    return request({
      url: `${baseURL}/${this.uri}/search-admin`,
      method: 'post',
      data: data
    })
  }

  searchAgency(data) {
    return request({
      url: `${baseURL}/${this.uri}/search-agency`,
      method: 'post',
      data: data
    })
  }

  getAllAgency(query) {
    return request({
      url: baseURL + `/agency/search`,
      method: 'get',
      params: query
    })
  }
  /**
   * tìm kiếm nhà cung cấp
   * /search/search-supplier
   * @param keyword_supplier
   * @returns {AxiosPromise}
   */
  searchSupplier(data) {
    return request({
      url: `${baseURL}/${this.uri}/search-supplier`,
      method: 'post',
      data: data
    })
  }
  /**
   * tìm kiếm ma booking
   * /search/search-code-booking
   * @param keyword_code_booking
   * @returns {AxiosPromise}
   */
  searchBooking(data) {
    return request({
      url: `${baseURL}/${this.uri}/search-code-booking`,
      method: 'post',
      data: data
    })
  }

  /**
   * tim kiem booking
   * /search-booked-by-code-booking
   * @param: {code_booking}
   * method: get
   */
  searchByBooking(data) {
    return request({
      url: `${baseURL}/${this.uri}/search-booked-by-code-booking`,
      method: 'post',
      data: data
    })
  }

  searchUserByBooked(data) {
    return request({
      url: `${baseURL}/${this.uri}/search-user-by-booked`,
      method: 'post',
      data: data
    })
  }

  searchGolfer(data) {
    return request({
      url: `${baseURL}/${this.uri}/search-golfer`,
      method: 'post',
      data: data
    })
  }

  listSupplier(params) {
    return request({
      url: `${baseURL}/${this.uri}/list-supplier`,
      method: 'get',
      params: params
    })
  }
}

export { SearchResource as default }
