import Resource from '@/api/resource'
import axios from '@/utils/axios'
// const baseURL = process.env.VUE_APP_BASE_API
const baseURL = process.env.VUE_APP_BASE_API_SUPPLIER

class ManageBrandResource extends Resource {
  constructor() {
    super('')
  }
  listBrand(query = { page: 1, limit: 10 }) {
    return axios({
      baseURL: process.env.VUE_APP_BASE_API_SUPPLIER,
      url: `${this.uri}/trademark/list`,
      method: 'get',
      params: query
    })
  }
  uploadImage(data) {
    return axios({
      url: baseURL + `/post_cdn`,
      method: 'post',
      data: data
    })
  }
  addBrand(data) {
    return axios({
      url: baseURL + `/trademark/create`,
      method: 'post',
      data: data
    })
  }
  editBrand(data) {
    return axios({
      url: baseURL + `/trademark/update`,
      method: 'post',
      data: data
    })
  }
  updateActiveBrand(data) {
    return axios({
      url: baseURL + `/trademark/change_active`,
      method: 'post',
      data: data
    })
  }
}

export { ManageBrandResource as default }
