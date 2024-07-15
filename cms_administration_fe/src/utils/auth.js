import Cookies from 'js-cookie'
import axios from 'axios'
const TokenKey = 'Admin-Token'
const accountKey = 'Account-info'
const permissionKey = 'Permissions'
const adminKey = 'admin'
const menuItemToken = 'listMenuItemToken'
const refreshTokenKey = 'refreshToken'
const adminAllKey = 'adminAll'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return Cookies.set(TokenKey, token, { expires: 0.2 })
}
export function setTokenListMenuItem(tokenList) {
  localStorage.setItem(menuItemToken, tokenList)
}
export function getTokenListMenuItem() {
  return localStorage.getItem(menuItemToken)
}
export function setRefreshToken(refreshToken) {
  localStorage.setItem(refreshTokenKey, refreshToken)
}

export function getRefreshToken() {
  return localStorage.getItem(refreshTokenKey)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setAcountInfo(account = {}) {
  return localStorage.setItem(accountKey, JSON.stringify(account))
  // return Cookies.set(accountKey, JSON.stringify(account))
}

export function setPermissions(permissions = []) {
  return Cookies.set(permissionKey, JSON.stringify(permissions))
}

export function getPermissions() {
  return JSON.parse(Cookies.get(permissionKey))
}

export function removeAccountInfo() {
  return localStorage.removeItem(accountKey)
  // return Cookies.remove(accountKey)
}

export function getAcountInfo() {
  // return Cookies.get(accountKey) ? JSON.parse(Cookies.get(accountKey)) : {}
  return localStorage.getItem(accountKey) ? JSON.parse(localStorage.getItem(accountKey)) : {}
}

export function setAdmin(admin = {}) {
  return Cookies.set(adminKey, JSON.stringify(admin))
}

export function getAdmin(account = '{}') {
  const admin = Cookies.get(adminKey)
  return admin ? JSON.parse(admin) : {}
}

export function removeAdmin() {
  return Cookies.remove(adminKey)
}

export function setAllAdmin(data = []) {
  return localStorage.setItem(adminAllKey, JSON.stringify(data))
}

export function getAllAdmin() {
  return JSON.parse(localStorage.getItem(adminAllKey))
}

export function removeAllAdmin() {
  return localStorage.removeItem(adminAllKey)
}
export function parseJson(json) {
  try {
    return JSON.parse(json)
  } catch (error) {
    return null
  }
}
