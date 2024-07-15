import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API
// const baseURL = 'http://localhost:9999'

class eventResource extends Resource {
  constructor() {
    super('event-club')
  }

  lists(query) {
    return request({
      url: baseURL + `/${this.uri}/lists`,
      method: 'get',
      params: query
    })
  }
  store(resource) {
    return request({
      url: baseURL + `/${this.uri}/store`,
      method: 'post',
      data: resource
    })
  }

  update(data, id) {
    return request({
      url: baseURL + `/${this.uri}/update/${id}`,
      method: 'post',
      data: data
    })
  }
  detail(id) {
    return request({
      url: baseURL + `/${this.uri}/detail/${id}`,
      method: 'get'
    })
  }

  remove(id) {
    return request({
      url: baseURL + `/${this.uri}/remove/${id}`,
      method: 'get'
    })
  }

  statistic_hot_event() {
    return request({
      url: baseURL + `/${this.uri}/statistic_hot_event`,
      method: 'get'
    })
  }

  // add user
  add_gofer_to_flight(data, id) {
    return request({
      url: baseURL + `/${this.uri}/add_gofer_to_flight/${id}`,
      method: 'post',
      data: data
    })
  }
  list_gofer_to_flight(data, id) {
    return request({
      url: baseURL + `/${this.uri}/list_gofer_to_flight/${id}`,
      method: 'post',
      data: data
    })
  }
  // thành tích
  list_achievement(data, id) {
    return request({
      url: baseURL + `/${this.uri}/list_achievement/${id}`,
      method: 'post',
      data: data
    })
  }
  store_achievement(data) {
    return request({
      url: baseURL + `/${this.uri}/store_achievement`,
      method: 'post',
      data: data
    })
  }
  remove_achievement(data) {
    return request({
      url: baseURL + `/${this.uri}/remove_achievement`,
      method: 'post',
      data: data
    })
  }

  list_option_achievement(query) {
    return request({
      url: baseURL + `/${this.uri}/list_option_achievement`,
      method: 'get',
      params: query
    })
  }
  store_option_achievement(data) {
    return request({
      url: baseURL + `/${this.uri}/store_option_achievement`,
      method: 'post',
      data: data
    })
  }
  update_option_achievement(data, id) {
    return request({
      url: baseURL + `/${this.uri}/update_option_achievement/${id}`,
      method: 'post',
      data: data
    })
  }
  remove_option_achievement(data) {
    return request({
      url: baseURL + `/${this.uri}/remove_option_achievement`,
      method: 'post',
      data: data
    })
  }
  change_status_custom(data, id) {
    return request({
      url: baseURL + `/${this.uri}/change_status_custom/${id}`,
      method: 'post',
      data: data
    })
  }

  // event draf
  list_event_draf(query) {
    return request({
      url: baseURL + `/${this.uri}/list_event_draf`,
      method: 'get',
      params: query
    })
  }
  store_event_draf(data) {
    return request({
      url: baseURL + `/${this.uri}/store_event_draf`,
      method: 'post',
      data: data
    })
  }
  update_status_event_draf(data, id) {
    return request({
      url: baseURL + `/${this.uri}/update_status_event_draf/${id}`,
      method: 'post',
      data: data
    })
  }
  remove_event_draf(id) {
    return request({
      url: baseURL + `/${this.uri}/remove_event_draf/${id}`,
      method: 'post',
      data: {}
    })
  }

  listTournament(query) {
    return request({
      url: baseURL + `/${this.uri}/list-tournament`,
      method: 'get',
      params: query
    })
  }
  storeTournament(resource) {
    return request({
      url: baseURL + `/${this.uri}/store-tournament`,
      method: 'post',
      data: resource
    })
  }

  updateTournament(data, id) {
    return request({
      url: baseURL + `/${this.uri}/update-tournament/${id}`,
      method: 'post',
      data: data
    })
  }

  removeTournament(id) {
    return request({
      url: baseURL + `/${this.uri}/delete-tournament/${id}`,
      method: 'get'
    })
  }

  searchTournament(resource) {
    return request({
      url: baseURL + `/${this.uri}/search-tournament`,
      method: 'post',
      data: resource
    })
  }

  searchUnitTournament(resource) {
    return request({
      url: baseURL + `/${this.uri}/search-unit-tournament`,
      method: 'post',
      data: resource
    })
  }

  searchNameEvent(resource) {
    return request({
      url: baseURL + `/${this.uri}/search-name-event`,
      method: 'post',
      data: resource
    })
  }

  listChanelTvEvent(query) {
    return request({
      url: baseURL + `/${this.uri}/list-chanel-event`,
      method: 'get',
      params: query
    })
  }

  listChanelTv(query) {
    return request({
      url: baseURL + `/${this.uri}/list-chanel-tv`,
      method: 'get',
      params: query
    })
  }
  storeChanelTV(resource) {
    return request({
      url: baseURL + `/${this.uri}/store-chanel-tv`,
      method: 'post',
      data: resource
    })
  }

  listMemberEvent(query) {
    return request({
      url: baseURL + `/${this.uri}/list-member-event`,
      method: 'get',
      params: query
    })
  }

  acceptMemberEvent(resource) {
    return request({
      url: baseURL + `/${this.uri}/accept-member-event`,
      method: 'post',
      data: resource
    })
  }

  listCompany(query) {
    return request({
      url: baseURL + `/${this.uri}/list-company`,
      method: 'get',
      params: query
    })
  }

  storeCompany(resource) {
    return request({
      url: baseURL + `/${this.uri}/store-company`,
      method: 'post',
      data: resource
    })
  }

  updateCompany(data, id) {
    return request({
      url: baseURL + `/${this.uri}/update-company/${id}`,
      method: 'post',
      data: data
    })
  }
  searchCompany(resource) {
    return request({
      url: baseURL + `/${this.uri}/search-company`,
      method: 'post',
      data: resource
    })
  }

  removeCompany(id) {
    return request({
      url: baseURL + `/${this.uri}/delete-company/${id}`,
      method: 'get'
    })
  }

  listMemberCompany(query) {
    return request({
      url: baseURL + `/${this.uri}/list-member-company`,
      method: 'get',
      params: query
    })
  }

  storeMemberCompany(resource) {
    return request({
      url: baseURL + `/${this.uri}/store-member-company`,
      method: 'post',
      data: resource
    })
  }
  removeMemberCompany(id) {
    return request({
      url: baseURL + `/${this.uri}/remove-member-company/${id}`,
      method: 'get'
    })
  }
}

export { eventResource as default }
