import Resource from '@/api/resource'
import axios from '@/utils/axios'
const baseURL = process.env.VUE_APP_BASE_API_SUPPLIER
// const baseURL = 'http://192.168.1.4:3000/api/public'
class ManageDebtResource extends Resource {
  constructor() {
    super('')
  }
  listDebt(query = { page: 1, limit: 10 }) {
    return axios({
      url: baseURL + `/supplier/list_debt`,
      method: 'get',
      params: query
    })
  }
  exportExcelListDebt(query = { page: 1, limit: 10 }) {
    return axios({
      url: baseURL + `/supplier/export_debt`,
      method: 'get',
      params: query
    })
  }
  listShop() {
    return axios({
      url: baseURL + `/shop/list_option`,
      method: 'get'
    })
  }
  listDebtHistory(query = { page: 1, limit: 10 }) {
    return axios({
      url: baseURL + `/supplier/list_debt_history`,
      method: 'get',
      params: query
    })
  }
  exportExcelListDebtHistory(query = { page: 1, limit: 10 }) {
    return axios({
      url: baseURL + `/supplier/export_debt_history`,
      method: 'get',
      params: query
    })
  }
  updateHistoryTrade(data) {
    return axios({
      url: baseURL + `/supplier/update_debt_history`,
      method: 'post',
      data: data
    })
  }
  countOverdueDebt() {
    return axios({
      url: baseURL + `/supplier/debt_count_for_payment`,
      method: 'get'
    })
  }
  deleteDebtTransaction(data) {
    return axios({
      url: baseURL + `/supplier/delete_history_debt`,
      method: 'post',
      data: data
    })
  }
}

export { ManageDebtResource as default }
