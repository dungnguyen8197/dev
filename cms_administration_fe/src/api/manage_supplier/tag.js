import Resource from '@/api/resource'
import axios from '@/utils/axios'
// const baseURL = process.env.VUE_APP_BASE_API
const baseURL = process.env.VUE_APP_BASE_API_SUPPLIER

class ManageTagResource extends Resource {
  constructor() {
    super('')
  }
  listCategory() {
    return axios({
      url: baseURL + `/category/list_option`,
      method: 'get'
    })
  }
  listTag(query = { page: 1, limit: 10 }) {
    return axios({
      url: baseURL + `/tags/list_for_cms`,
      method: 'get',
      params: query
    })
  }
  createTag(data) {
    return axios({
      url: baseURL + `/tags/create`,
      method: 'post',
      data
    })
  }
  updateTag(data) {
    return axios({
      url: baseURL + `/tags/update`,
      method: 'post',
      data
    })
  }
  activeTag(data) {
    return axios({
      url: baseURL + `/tags/change_active`,
      method: 'post',
      data
    })
  }
}

export { ManageTagResource as default }
