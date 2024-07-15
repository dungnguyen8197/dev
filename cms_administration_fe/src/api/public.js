import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API

class PublicResource extends Resource {
  constructor() {
    super('public')
  }

  downloadFileExcelExample(query) {
    return request({
      url: baseURL + `/${this.uri}/file-excel-example`,
      method: 'get',
      params: query
    })
  }
}

export { PublicResource as default }
