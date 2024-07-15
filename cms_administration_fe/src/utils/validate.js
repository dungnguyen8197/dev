/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

export const isVietNamPhone = (phone) => {
  const reg = /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/
  return reg.test(phone)
}

export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) || (typeof value === 'object' && Array.isArray(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0) || value === 'undefined'
  )
}

export const validateText = (rule, value, callback, name, min = 0, max = 0) => {
  if (isEmpty(value)) {
    callback(new Error(`${name} không được để trống`))
  } else if (
    (value.length < min || value.length > max) &&
    !(min === 0 && max === 0)
  ) {
    callback(new Error(`${name} phải có độ dài từ ${min} đến ${max} ký tự`))
  } else callback()
}

export const validateTextAndCondition = (rule, value, callback, name, condition, min = 0, max = 0) => {
  if (isEmpty(value) && (!isEmpty(condition))) {
    callback(new Error(`${name} không được để trống`))
  } else if (
    !isEmpty(value) && (value.length < min || value.length > max) &&
    !(min === 0 && max === 0) && (!isEmpty(condition))
  ) {
    callback(new Error(`${name} phải có độ dài từ ${min} đến ${max} ký tự`))
  } else callback()
}

export const validateEndAtAndCondition = (rule, start_at = '', end_at, callback, name, condition) => {
  if (!start_at && !isEmpty(condition)) {
    callback(new Error(`${name} không được để trống`))
  } else if (new Date(end_at) < new Date(start_at) && !isEmpty(condition)) {
    callback(new Error(`${name} không được nhỏ hơn thời gian bắt dầu`))
  } else callback()
}

export const validateTextArea = (rule, value, callback, name, min = 0, max = 0) => {
  const regex = /^\n/g
  if (isEmpty(value)) {
    callback(new Error(`${name} không được để trống`))
  } else if (
    (value.length < min || value.length > max) &&
    !(min === 0 && max === 0)
  ) {
    callback(new Error(`${name} phải có độ dài từ ${min} đến ${max} ký tự`))
  } else if (regex.test(value)) {
    callback(new Error(`${name} không được enter xuống dòng ở đầu tiên`))
  } else callback()
}

export const validateImage = (rule, value, callback, name) => {
  console.log(value, 'value image')
  if (!value) {
    callback(new Error(`${name} không được để trống`))
  } else callback()
}
export const validateSelect = (rule, value, callback, name) => {
  console.log(value, 'value select')
  if (!value) {
    callback(new Error(`${name} không được để trống`))
  } else callback()
}
export const validateVoucherType = (rule, discount_type, voucher_type, callback, name, min = 0, max = 0) => {
  if (isEmpty(voucher_type)) {
    callback(new Error(`${name} không được để trống`))
  } else if (discount_type === 3 && voucher_type !== 4) {
    callback(new Error(`Bạn cần chọn loại "Quà tặng" do loại khuyến mãi bạn chọn là "Sản phẩm quà tặng"`))
  } else callback()
}

export const validateEndAt = (rule, start_at = '', end_at, callback, name) => {
  if (!end_at) {
    callback(new Error(`${name} không được để trống`))
  } else if (new Date(end_at) < new Date()) {
    callback(new Error(`${name} không được nhỏ hơn thời gian hiện tại`))
  } else if (new Date(end_at) < new Date(start_at)) {
    callback(new Error(`${name} không được nhỏ hơn thời gian bắt dầu`))
  } else callback()
}

export const validateAllocationType = (rule, allocation_type, price, callback, name, type = 0, max = 0) => {
  if (isEmpty(allocation_type) && type) {
    callback(new Error(`${name} không được để trống`))
  } else if (allocation_type === 4 && isEmpty(price)) {
    callback(new Error(`Bạn cần nhập giá do loại hình phân phối bạn chọn là "Bán"`))
  } else if (allocation_type !== 4 && !isEmpty(price) && type) {
    callback(new Error(`Bạn cần chọn loại hình phân phối "Bán" do bạn nhập giá bán voucher (>0 giá trị bán ra)`))
  } else callback()
}

export const validateConditionAddVoucher = (rule, auto_add_type, allocation_type, callback, name, type = 0, max = 0) => {
  if (isEmpty(auto_add_type) && allocation_type === 3) {
    callback(new Error(`${name} không được để trống do bạn đã chọn Hình thức phân phối theo điều kiện`))
  } else callback()
}

export const validateCodeVoucher = (rule, value, callback, name) => {
  const regex = /^[a-zA-Z0-9]+$/

  if (!value) {
    callback(new Error(`${name} không được để trống`))
  } else if (!regex.test(value)) {
    callback(new Error(`${name} phải viết liền và chỉ bao gồm các ký tự chữ cái viết thường, viết hoa và số`))
  } else callback()
}

export const validateWebsite = (rule, value, callback, name, screen_target_data) => {
  if (screen_target_data === 2 || screen_target_data === 3) {
    const regex = /^(http(s)?):\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g

    if (!value) {
      callback(new Error(`${name} không được để trống`))
    } else if (!regex.test(value.trim())) {
      callback(new Error(`${name} không đúng định dạng (ex: https://google.com, http://google.com)`))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

export const validatePhoneNumber = (
  rule,
  value,
  callback,
  name,
  min = 0,
  max = 0
) => {
  if (isEmpty(value)) {
    callback(new Error(`${name} không được để trống`))
  } else if (
    (value.length < min || value.length > max) &&
    !(min === 0 && max === 0)
  ) {
    callback(new Error(`${name} phải có độ dài từ ${min} đến ${max} ký tự`))
  } else if (!isVietNamPhone(value)) {
    callback(new Error(`${name} không đúng định dạng`))
  } else callback()
}

export const validatePhoneNumberWithEmpty = (
  rule,
  value,
  callback,
  name,
  min = 0,
  max = 0
) => {
  if (isEmpty(value)) {
    callback()
  } else if (
    (value.length < min || value.length > max) &&
    !(min === 0 && max === 0)
  ) {
    callback(new Error(`${name} phải có độ dài từ ${min} đến ${max} ký tự`))
  } else if (!isVietNamPhone(value)) {
    callback(new Error(`${name} không đúng định dạng`))
  } else callback()
}

export const validateNumber = (
  rule,
  value,
  callback,
  name,
  min = 0,
  max = 0
) => {
  if (isEmpty(value)) {
    callback(new Error(`${name} không được để trống`))
  } else if (
    (value < min || value > max) &&
    !(min === 0 && max === 0)
  ) {
    callback(new Error(`${name} phải >= ${min} và <= ${max}`))
  } else callback()
}
export const validateDate = (rule, value, callback, name) => {
  if (!value) {
    callback(new Error(`${name} không được để trống`))
  } else callback()
}

export const validateArray = (rule, value, callback, name) => {
  if (isEmpty(value)) {
    callback(new Error(`${name} không được để trống`))
  } else if (!Array.isArray(value)) {
    callback(new Error(`${name} không đúng định dạng`))
  } else callback()
}

export const validateEmail = (rule, value, callback, name) => {
  if (isEmpty(value)) {
    callback(new Error(`${name} không được để trống`))
  } else if (!validEmail(value)) {
    callback(new Error(`Email sai định dạng`))
  } else {
    callback()
  }
}
export const validateSelectNotEmpty = (rule, value, callback, name) => {
  if (!value || value.length === 0) {
    callback(new Error(`${name} không được để trống`))
  } else {
    callback()
  }
}
