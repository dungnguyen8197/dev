import Resource from '@/api/resource'
import axios from '@/utils/axios'
const baseURL = process.env.VUE_APP_BASE_API_SUPPLIER
// const baseURL = 'http://192.168.1.4:3000/api/public'
class ManagePermissionResource extends Resource {
  constructor() {
    super('')
  }
  listAccount(query = { page: 1, limit: 10 }) {
    return axios({
      url: baseURL + `/permission/list_account_cms`,
      method: 'get',
      params: query
    })
  }
  listPermissionOfAccount(query) {
    return axios({
      url: baseURL + `/permission/list_menu`,
      method: 'get',
      params: query
    })
  }
  listMenuForAdd(query) {
    return axios({
      url: baseURL + `/permission/list_menu_for_add`,
      method: 'get',
      params: query
    })
  }
  addMenuToAccount(data) {
    return axios({
      url: baseURL + `/permission/add_menu_to_account`,
      method: 'post',
      data: data
    })
  }
  changeActiveAccount(data) {
    return axios({
      url: baseURL + `/permission/change_active`,
      method: 'post',
      data: data
    })
  }
  changeActiveMenu(data) {
    return axios({
      url: baseURL + `/permission/change_active_menu`,
      method: 'post',
      data: data
    })
  }
  updateSubPermission(data) {
    return axios({
      url: baseURL + `/permission/update_permission_menu`,
      method: 'post',
      data: data
    })
  }
}

export { ManagePermissionResource as default }
