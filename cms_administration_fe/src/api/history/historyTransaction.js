import Resource from '@/api/resource'
import request from '@/utils/request'
// const baseURL = process.env.VUE_APP_BASE_API

class historyTransactionResource extends Resource {
  constructor() {
    super('history')
  }

  listTransaction(data) {
    return request({
      url: `/${this.uri}/listTransaction`,
      method: 'post',
      data
    })
  }
}

export { historyTransactionResource as default }
