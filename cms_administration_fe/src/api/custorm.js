import Resource from '@/api/resource'
import request from '@/utils/request'

const api = 'https://wghn-api-staging.vcallid.com'
class CustomResource extends Resource {
  constructor() {
    super('api/v1/member_zone')
  }

  /**
   * list khachs hangf than thiet
   * https://wghn-api-staging.vcallid.com/api/v1/member_zone/list?uid=17882&token=02a207092729d8f09beb5df9687eee74&lang=vn&uuid=fd3e1f53-945c-4b3d-957d-612bd154d995&readableVersion=2.8.1&majorVersionIOS=16&is_vCall=1&flight_id=2592929
   * @param query {limit, page, uid, token}
   * @returns {*}
   * method: get
   */
  customList(query) {
    return request({
      url: `${api}/${this.uri}/list`,
      method: 'get',
      params: query
    })
  }

  /**
   * xóa khachs hangf than thiet
   * https://wghn-api-staging.vcallid.com/api/v1/member_zone/delete/1
   * @param id
   * @returns {*}
   * method: get
   */
  customRemove(id) {
    return request({
      url: `${api}/${this.uri}/delete/${id}`,
      method: 'get'
    })
  }

  /**
   * chi tiết
   * https://wghn-api-staging.vcallid.com/api/v1/member_zone/detail/1
   * @param id
   * @returns {*}
   * method: get
   */
  customDetail(id) {
    return request({
      url: `${api}/${this.uri}/detail/${id}`,
      method: 'get'
    })
  }

  /**
   * tạo mới custom
   * https://wghn-api-staging.vcallid.com/api/v1/member_zone/create
   * @body  {"user_id":"126",
   *         "user_id_request":1,
   *         "user_id_approve":2,
   *         "is_approve":0,
   *         "start_date":"2023-08-01",
   *         "end_date":"2024-08-01"
   * }
   * @method post
   */
  storeCustom(resource) {
    return request({
      url: `${api}/${this.uri}/create`,
      method: 'post',
      data: resource
    })
  }

  /**
   * tạo mới custom
   * https://wghn-api-staging.vcallid.com/api/v1/member_zone/update
   * @body   {"id":1,
   *     "is_approve":1,
   *     "start_date":"2023-08-01",
   * "end_date":"2024-08-01"
   * }
   * @method post
   */
  updateCustom(resource) {
    return request({
      url: `${api}/${this.uri}/update`,
      method: 'post',
      data: resource
    })
  }

  /**
   * import file excel
   * body {file}
   * https://wghn-api-staging.vcallid.com/api/v1/member_zone/import_by_exels
   */
  importExcelCustom(resource) {
    return request({
      url: `${api}/${this.uri}/import_by_exels`,
      method: 'post',
      data: resource
    })
  }
}

export { CustomResource as default }
