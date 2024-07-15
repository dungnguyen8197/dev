export const STATUS_VOUCHER = {
  0: { type: 'warning', label: 'Chờ' },
  1: { type: 'success', label: 'Mở cho phép sử dụng' },
  2: { type: 'primary', label: 'Đóng' },
  3: { type: 'danger', label: 'Khóa' }
}

export const ARRAY_STATUS_VOUCHER = Object.entries(STATUS_VOUCHER).map(([key, value]) => ({
  value: parseInt(key),
  label: value.label
}))

export const STATUS_PARTNER_SERVICE = {
  0: { type: 'danger', label: 'Đóng' },
  1: { type: 'success', label: 'Mở' }
}

export const ARRAY_STATUS_PARTNER_SERVICE = Object.entries(STATUS_PARTNER_SERVICE).map(([key, value]) => ({
  value: parseInt(key),
  label: value.label
}))

export const DISCOUNT_TYPE = {
  1: 'Số tiền cố định',
  2: 'Tỉ lệ',
  3: 'Sản phẩm quà tặng'
}

export const ARRAY_DISCOUNT_TYPE = Object.entries(DISCOUNT_TYPE).map(([key, value]) => ({
  value: parseInt(key),
  label: value
}))

export const ALLOCATION_TYPE = {
  1: 'User tự lưu',
  2: 'CMS phân phối',
  3: 'Tự động phân phối theo điều kiện',
  4: 'Bán'
}

export const ARRAY_ALLOCATION_TYPE = Object.entries(ALLOCATION_TYPE).map(([key, value]) => ({
  value: parseInt(key),
  label: value
}))

export const VOUCHER_TYPE = {
  1: 'Chiết khấu',
  2: 'Hoàn point',
  3: 'Giảm giá ship',
  4: 'Quà tặng'
}

export const ARRAY_VOUCHER_TYPE = Object.entries(VOUCHER_TYPE).map(([key, value]) => ({
  value: parseInt(key),
  label: value
}))

export const ARRAY_AUTO_ADD_TYPE = [
  { value: 1, label: 'Tổng đơn thanh toán tối thiểu' },
  { value: 2, label: 'Mua sản phẩm thuộc danh sách' },
  { value: 3, label: 'Tổng chi tiêu tối thiểu trong khoảng thời gian(Phức tạp, chưa hỗ trợ)' },
  { value: 4, label: 'Sinh nhật' },
  { value: 5, label: 'Thăng hạng hội viên' }
]

export const ARRAY_CONDITION = [
  { value: 1, label: 'Khách hàng trong phạm vi điểm HDC' },
  { value: 2, label: 'Giá trị đơn hàng tối thiểu' },
  { value: 4, label: 'Theo danh sách sản phẩm cố định' },
  { value: 5, label: 'Theo số lượng người chơi' },
  { value: 6, label: 'Theo nhà phân phối' },
  { value: 7, label: 'Theo hạng hội viên' },
  { value: 8, label: 'Theo khung thời gian trong ngày' },
  { value: 9, label: 'Theo phương thức thanh toán' },
  { value: 10, label: 'Theo ngân hàng thanh toán' }
]

export const STATUS_PRODUCT_PARTNER = {
  0: { type: 'info', label: 'Chuẩn bị bán' },
  1: { type: 'success', label: 'Đang bán' },
  2: { type: 'danger', label: 'Hết hàng' }
}

export const ARRAY_STATUS_PRODUCT_PARTNER = Object.entries(STATUS_PRODUCT_PARTNER).map(([key, value]) => ({
  value: parseInt(key),
  label: value.label
}))

export const TYPE_REGION = {
  MIEN_BAC: 1,
  MIEN_TRUNG: 2,
  MIEN_NAM: 3
}
export const REGION_INFO = {
  1: {
    bank_account_number: 888899988,
    bank_account_name: 'CONG TY CO PHAN DICH  VU DAT SAN GOLF VIET NAM',
    bank_name: 'Ngân hàng TMCP Nam Á',
    bank: 970428
  },
  2: {
    bank_account_number: 1018888,
    bank_account_name: 'CONG TY CO PHAN DICH VU GOLF VIET NAM CENTRAL',
    bank_name: 'Ngân hàng TMCP Nam Á',
    bank: 970428
  },
  3: {
    bank_account_number: 131366888,
    bank_account_name: 'CONG TY CO PHAN DICH VU DAT SAN GOLF VIET NAM',
    bank_name: 'Ngân hàng TMCP Nam Á',
    bank: 970428
  }
}
export const ARRAY_ROLE_CLUB = ['role_boss_club', 'role_leader_club', 'role_secretary_club']

export const ARRAY_ADMIN = ['0989531411']

export const LIST_TYPE_CARD = {
  '0': '',
  1: 'Thẻ Infinite - Miễn Phí',
  2: 'Thẻ World MC - Giảm Phí',
  3: 'Thẻ World MC - Miễn Phí',
  4: 'Thẻ VIP - Miễn Phí',
  5: 'Thẻ Infinite FLC - Miễn phí'
}

export const REGIONS = {
  1: {
    label: 'Miền Bắc'
  },
  2: {
    label: 'Miền Nam'
  },
  3: {
    label: 'Miền Trung'
  }
}

export const LIST_HOLIDAY = ['01-09-2023', '02-09-2023', '03-09-2023', '04-09-2023', '01-01-2024', '18-04-2024', '29-04-2024', '30-04-2024', '01-05-2024']

export const STATUS_CHILD_SERVICE = {
  0: 'Chưa thanh toán',
  // 1: 'Thanh toán tại sân',
  // 2: 'Thanh toán online',
  3: 'Chuyển khoản',
  4: 'Thanh toán point',
  // 11: 'Thanh toán SACOM',
  10: 'Thanh toán visa',
  12: 'Thanh toán chuyển khoản bằng Code Payment',
  // 13: 'Thanh toán NAB',
  14: 'Đã hủy'
}

export const ARRAY_STATUS_CHILD_SERVICE = Object.entries(STATUS_CHILD_SERVICE).map(([key, value]) => ({
  value: parseInt(key),
  label: value
}))

export const NAME_PROVIDER = {
  BOOKING: 'booking_new',
  BOOKING_MN: 'booking_mn_new',
  BOOKING_MT: 'booking_mt_new',
  HIO: 'buy_hio',
  BOOKING_OUTSIDE: 'booking_outside_new',
  SHOP: 'shop'
}

export const OPTIONS_MONEY_HIO = {
  D100: 1,
  D200: 3,
  D20: 9,
  D50: 14
}

export const LIST_BANK_ACCOUNT = [
  { label: '20098849999 - Ngân hàng TMCP Sài Gòn Thương tín', value: '20098849999' },
  { label: '3066011566666 - Ngân hàng TMCP Hàng hải Việt Nam', value: '3066011566666' },
  { label: '114002914443 - Ngân hàng TMCP Công Thương Việt Nam', value: '114002914443' },
  { label: '119002907921 - Ngân hàng TMCP Công Thương Việt Nam', value: '119002907921' },
  { label: '121366999 - Ngân hàng TMCP NAM Á', value: '121366999' },
  { label: '122861313 - Ngân hàng TMCP NAM Á', value: '122861313' },
  { label: '131355468 - Ngân hàng TMCP NAM Á', value: '131355468' },
  { label: '131355668 - Ngân hàng TMCP NAM Á', value: '131355668' },
  { label: '131355899 - Ngân hàng TMCP NAM Á', value: '131355899' },
  { label: '135566888 - Ngân hàng TMCP NAM Á', value: '135566888' },
  { label: '801114474566688 - Ngân hàng TMCP NAM Á', value: '801114474566688' },
  { label: '888899988 - Ngân hàng TMCP NAM Á', value: '888899988' },
  { label: '131366888 - Ngân hàng TMCP NAM Á', value: '131366888' },
  { label: '668797988888 - Ngân hàng TMCP Á Châu', value: '668797988888' },
  { label: '9201100133006 - Ngân hàng TMCP Quân đội', value: '9201100133006' },
  { label: '9201168466666 - Ngân hàng TMCP Quân đội', value: '9201168466666' },
  { label: '9201184888888 - Ngân hàng TMCP Quân đội', value: '9201184888888' },
  { label: '1018888 - Ngân hàng TMCP NAM Á', value: '1018888' },
  { label: '04028327101 - Ngân hàng TPbank', value: '04028327101' },
  { label: '12110000973510 - Ngân hàng BIDV', value: '12110000973510' },
  { label: '78868888 - Ngân hàng Techcombank', value: '78868888' }
]

