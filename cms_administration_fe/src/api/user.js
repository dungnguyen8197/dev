import request from '@/utils/request'

// import { decode } from 'jszip/lib/base64'
const baseUrl = process.env.VUE_APP_BASE_API_SUPPLIER
export function login(data) {
  return request({
    url: '/admin/verify-otp',
    method: 'post',
    data
  })
}

export function getInformation(token) {
  return request({
    url: '/admin/detail',
    method: 'get',
    data: { token }
  })
}
export function getListMenuItem(data) {
  return request({
    url: baseUrl + '/supplier/list_supplier_menu_item',
    method: 'post',
    data: data
  })
}
export function logout() {
  return request({
    url: 'admin/logout',
    method: 'post'
  })
}

export function getOTP(data) {
  return request({
    url: 'admin/send-otp',
    method: 'post',
    data
  })
}

export function getCaptcha(param) {
  return request({
    url: 'admin/get-captcha',
    method: 'get',
    params: param
  })
}

export function verifyCaptcha(param) {
  return request({
    url: '/admin/verify-captcha',
    method: 'get',
    params: param
  })
}

export function getAllAdmin() {
  return request({
    url: '/admin/get-all-admin',
    method: 'get'
  })
}
