import Resource from '@/api/resource'
import request from '@/utils/request'

class OtherResource extends Resource {
  searchGolfer(query, data) {
    return request({
      url: `/other_service/search_golfer`,
      method: 'POST',
      data,
      params: query
    })
  }
}
export { OtherResource as default }
