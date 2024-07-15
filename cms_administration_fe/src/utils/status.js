// import Layout from '@/layout'

export function statusRealPayment(status) {
  const statusMap = {
    0: 'Chưa trả',
    1: 'Đã trả',
    2: 'Đang trả'
  }
  return statusMap[status]
}

export function statusDevice() {
  return {
    0: 'Chưa sử dụng',
    1: 'Đang sử dụng',
    2: 'Sửa chữa, bảo dưỡng',
    3: 'Hỏng, mất, thanh lý',
    4: 'Khác'
  }
}

export function statusT99(status) {
  const statusMap = {
    0: 'Vừa khởi tạo',
    1: 'Đang chờ',
    2: 'Chấp nhận',
    3: 'Từ chối',
    4: 'Hợp đồng đã ký',
    5: 'Chờ giải ngân',
    6: 'Đã giải ngân',
    7: 'Đã tất toán',
    8: 'Quá hạn',
    9: 'Hủy',
    10: '',
    11: '',
    12: 'Chờ ký hợp đồng'
  }
  return statusMap[status]
}

export function getNameById(id) {
  const admin = {
    1: 'Kiendt',
    2: 'Kelly'
  }
  return admin[id]
}

export function arrayStatusT99() {
  return {
    0: 'Vừa khởi tạo',
    1: 'Đang chờ',
    2: 'Chấp nhận',
    3: 'Từ chối',
    4: 'Hợp đồng đã ký',
    5: 'Chờ giải ngân',
    6: 'Đã giải ngân',
    7: 'Đã tất toán',
    8: 'Quá hạn',
    9: 'Hủy',
    12: 'Chờ ký hợp đồng'
  }
}

export function arrayStatusCredit() {
  return {
    0: 'Đang chờ duyệt',
    1: 'Dưới 100 triệu',
    2: 'Từ 100 đến 300 triệu',
    3: 'Từ 300 đến 500 triệu',
    4: 'Trên 500 triệu'
  }
}

export function arrayTypeService() {
  return {
    1: 'PAYBILL',
    2: 'TOPUP',
    3: 'DATA'
  }
}

export function typeService(type_service) {
  const array = arrayTypeService()
  return array[type_service]
}

export function arrayTransactionStatus() {
  return {
    0: 'Đang chờ xác nhận',
    1: 'Thành công',
    2: 'Thất bại',
    3: 'Kiểm tra lại'
  }
}

export function transactionStatus(trans_status) {
  const array = arrayTransactionStatus()
  return array[trans_status ]
}

export function arrayPaymentStatus() {
  return {
    0: 'Đang chờ xác nhận',
    1: 'Thành công',
    2: 'Thất bại'
  }
}

export function paymentStatus(payment_status) {
  const array = arrayPaymentStatus()
  return array[payment_status]
}

export function statusCredit(status) {
  const array = arrayStatusCredit()
  return array[status]
}
// export function checkSupperAdmin(roles) {
//   if (!roles || !roles.length) return
//   for (const role of roles) {
//     if (role.level === 6) {
//       this.menuSuperAgent()
//     } else if (role.level === 7) {
//       this.menuAgent()
//     } else {
//       this.menus()
//     }
//   }
// }

export function menuAgent() {
  // return [{
  //   path: '/sell_vga',
  //   component: Layout,
  //   redirect: '/sell_vga/list',
  //   name: 'sell_vga',
  //   meta: {
  //     title: 'Bán mã VGA',
  //     icon: 'sell_vga'
  //   },
  //   roles: ['sell_vga'],
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/sell-vga/List'),
  //       name: 'Bán mã VGA',
  //       meta: { title: 'Bán mã VGA' }
  //     }
  //   ]
  // }, {
  //   path: '/history_vga',
  //   component: Layout,
  //   redirect: '/history_vga/list',
  //   name: 'history_vga',
  //   meta: {
  //     title: 'Lịch sử bán mã VGA',
  //     icon: 'history_vga'
  //   },
  //   roles: ['history_vga'],
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/history_vga/List'),
  //       name: 'Lịch sử bán mã VGA',
  //       meta: { title: 'Lịch sử bán mã VGA' }
  //     }
  //   ]
  // }]
}
export function menuSuperAgent() {
  // return [{
  //   path: '/sell_vga',
  //   component: Layout,
  //   redirect: '/sell_vga/list',
  //   name: 'sell_vga',
  //   meta: {
  //     title: 'Bán mã VGA',
  //     icon: 'sell_vga'
  //   },
  //   roles: ['sell_vga'],
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/sell-vga/List'),
  //       name: 'Bán mã VGA',
  //       meta: { title: 'Bán mã VGA' }
  //     }
  //   ]
  // }, {
  //   path: '/history_vga',
  //   component: Layout,
  //   redirect: '/history_vga/list',
  //   name: 'history_vga',
  //   meta: {
  //     title: 'Lịch sử bán mã VGA',
  //     icon: 'history_vga'
  //   },
  //   roles: ['history_vga'],
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/history_vga/List'),
  //       name: 'Lịch sử bán mã VGA',
  //       meta: { title: 'Lịch sử bán mã VGA' }
  //     }
  //   ]
  // }, {
  //   path: '/management_agent',
  //   component: Layout,
  //   redirect: '/management_agent/list',
  //   name: 'management_agent',
  //   meta: {
  //     title: 'Quản lý đại lý',
  //     icon: 'management_agent'
  //   },
  //   roles: ['management_agent'],
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/management_agent/List'),
  //       name: 'Quản lý đại lý',
  //       meta: { title: 'Quản lý đại lý' }
  //     }
  //   ]
  // }]
}
export function menus() {
  // return [{
  //   active: 1,
  //   createdAt: '2022-02-17 17:43:06',
  //   icon: 'dashboard',
  //   id: 24,
  //   is_admin: 1,
  //   name: 'Lịch sử tất toán',
  //   path: '/t99',
  //   // sort_by: 7,
  //   updatedAt: '2022-02-17 17:43:06'
  // }, {
  //   active: 1,
  //   createdAt: null,
  //   icon: 'el-icon-user',
  //   id: 1,
  //   is_admin: 1,
  //   name: 'Account',
  //   path: '/Account',
  //   // sort_by: 10,
  //   updatedAt: null
  // }]
}

export function telcoStatus() {
  return {
    1: 'Viettel',
    2: 'Vinaphone',
    3: 'Mobifone',
    4: 'Vietnamobile',
    5: 'Gtel',
    6: 'Itelecom',
    7: 'Reddi'
  }
}

export function promotionTypes() {
  return {
    1: 'Theo danh sách nhà mạng',
    2: 'Theo danh sách sản phẩm'
  }
}

export function promotionTypeDiscounts() {
  return {
    1: 'Theo tỉ lệ',
    2: 'Theo số tiền cố định'
  }
}

export function promotionTypeServices() {
  return {
    1: 'Thanh toán hoá đơn',
    2: 'Nạp tiền điện thoại',
    3: 'Mua Data'
  }
}

export function promotionTypeLimitPromotions() {
  return {
    1: 'Không giới hạn',
    2: 'Giới hạn theo thời gian'
  }
}

export function promotionTypeLimitDiscounts() {
  return {
    1: 'Không giới hạn',
    2: 'Giới hạn theo số tiền cố định'
  }
}

export function promotionProviders() {
  return {
    1: 'Iris',
    2: 'Mobifone'
  }
}

// const TYPE_PURCHASE_FOUND = 0 // CHƯA THANH TOÁN
// const TYPE_PURCHASE_CURRENT_FACILITY = 1 // THANH TOÁN TẠI SÂN
// const TYPE_PURCHASE_ONLINE = 2 // THANH TOÁN ONLINE
// const TYPE_PURCHASE_TRANSFER = 3 // CHUYỂN KHOẢN
// const TYPE_PURCHASE_POINT = 4 // THANH TOÁN POINT
// const TYPE_PURCHASE_SACOMBANK = 11 // THANH TOÁN SACOM
// const TYPE_PURCHASE_VISA = 10 // THANH TOÁN VISA
// const TYPE_PURCHASE_TRANSFER_CODE_PAYMENT = 12 // THANH TOÁN CHUYỂN KHOẢN NGÂN HÀNG BẰNG CODE PAYMENT
// const TYPE_PURCHASE_NAB = 13 // THANH TOÁN NAB
export function arrayTypePurchase() {
  return {
    0: 'Chưa thanh toán',
    1: 'Thanh toán tại sân',
    2: 'Thanh toán online',
    3: 'Chuyển khoản',
    4: 'Thanh toán point',
    11: 'Thanh toán SACOM',
    10: 'Thanh toán visa',
    12: 'Thanh toán chuyển khoản bằng Code Payment',
    13: 'Thanh toán NAB',
    15: 'Thanh toán ePay Techcombank',
    16: 'Thanh toán ePay BIDV',
    17: 'Thanh toán ePay',
    14: 'Đã hủy'
  }
}

export function typePurchase(type) {
  const array = arrayTypePurchase()
  return array[type]
}

export function arrayTypePurchaseBill() {
  return {
    0: 'Tạo hóa đơn',
    1: 'Đã thanh toán',
    2: 'Chờ thanh toán',
    3: 'Thanh toán lỗi'
  }
}

export function typePurchaseBill(type) {
  const array = arrayTypePurchaseBill()
  return array[type]
}

export const STATUS_BILL = {
  0: 'Khởi tạo chờ xác nhận',
  1: 'Đã thanh toán',
  2: 'Thất bại',
  3: 'Chờ thanh toán'
}

export const PAYMENT_METHOD = {
  'bank': 'Chuyển khoản bằng Code payment',
  'point': 'Thanh toán point',
  'visa': 'Thanh toán visa',
  'cms': 'Chuyển khoản'
}

export const COLOR_STATUS = {
  '-1': 'primary',
  0: 'primary',
  1: 'success',
  2: 'danger',
  3: 'waring',
  4: 'danger',
  5: 'success',
  6: 'danger',
  7: 'danger'
}

export const MISA_VOUCHER_STATUS = {
  '-1': 'Khởi tạo',
  0: 'Khởi tạo',
  1: 'Hoàn thành',
  2: 'Thất bại',
  3: 'Đang xử lý',
  4: 'Thất bại',
  5: 'Hoàn thành',
  6: 'Thất bại',
  7: 'Thất bại'
}

export const MISA_VOUCHER_STATUS_MAP_DATA = [
  { value: 0, label: 'Khởi tạo', array_value: [0, -1] },
  { value: 1, label: 'Hoàn thành', array_value: [1, 5] },
  { value: 2, label: 'Thất bại', array_value: [2, 4, 6, 7] },
  { value: 3, label: 'Đang xử lý', array_value: [3] }
]

export const SCREEN_APP = {
  0: 'Màn Poster/Text',
  1: 'Chuyển link web',
  6: 'Màn hình bảo hiểm',
  11: 'Màn hình danh sách Voucher',
  18: 'Màn hình mua mã',
  20: 'Màn hình danh sách Tour',
  25: 'Màn hình Shop',
  26: 'Màn hình vNews',
  31: 'Màn hình mở tài khoản',
  32: 'Màn hình Sale mã',
  33: 'Màn hình đóng phí hội viên',
  35: 'Màn hình sale nâng hạng thành viên',
  // 40: 'Màn hình T99',
  42: 'Màn hình mua mã VGA Digital',
  48: 'Màn hình nạp tiền'
}
export const POSITION = {
  Top: 1,
  Mid: 2,
  Bottom: 3
}

export const list_position = [
  { value: POSITION.Top, label: 'Top' },
  { value: POSITION.Mid, label: 'Mid' },
  { value: POSITION.Bottom, label: 'Bottom' }
]
export const BRANCH_NAME = {
  0: 'WGHN',
  1: 'Notification',
  2: 'WBooking'
}

export const TYPE_ADV = {
  1: 'Booking',
  2: 'Travel',
  3: 'Shop',
  4: 'Event',
  5: 'Sport',
  6: 'Digital',
  7: 'Ngân hàng số',
  8: 'HDC'
}

export const STATUS_NOTIFY = {
  '-1': 'Stop',
  0: 'Khởi tạo',
  1: 'Đang bắn tin nhắn',
  2: 'Hoàn thành'
}
export const COLOR_STATUS_NOTI = {
  0: 'waring',
  1: 'primary',
  2: 'success',
  3: 'waring',
  '-1': 'danger'
}

export const REGION = {
  1: 'Miền Bắc',
  2: 'Miền Trung',
  3: 'Miền Nam'
}

export const TYPE_STATUS_HIO_PHYSICAL = {
  0: 'Chờ duyệt',
  1: 'Đã hoàn thành',
  2: 'CMS đã xác nhận, chờ kiểm định',
  3: 'Đã kiểm định, chờ xác nhận từ PVI'
}

export const STATUS_SEND_PVI = {
  0: 'Chưa gửi PVI',
  1: 'Hoàn thành gửi đơn PVI',
  2: 'Đã gửi, chờ phản hồi PVI'
}
export const TYPE_STATUS_HIO_PHYSICAL_INIT = 0
export const TYPE_STATUS_HIO_PHYSICAL_SUCCESS = 1
export const TYPE_STATUS_HIO_PHYSICAL_CMS_CONFIRM = 2
export const TYPE_STATUS_HIO_PHYSICAL_PVI = 3

export const TYPE_PURCHASE_BILL_OUTSIDE = {
  0: 'Tạo hóa đơn',
  1: 'Đã thanh toán',
  2: 'Chờ thanh toán',
  3: 'Thanh toán lỗi'
}

export const TYPE_PURCHASE_BILL_OUTSIDE_INIT = 0
export const TYPE_PURCHASE_BILL_OUTSIDE_SUCCESS = 1
export const TYPE_PURCHASE_BILL_OUTSIDE_WAIT = 2
export const TYPE_PURCHASE_BILL_OUTSIDE_ERROR = 3

// LOẠI PHỤ PHÍ. 1: MÃ RIÊNG, 2: MÃ CHUNG
export const TYPE_FEE = {
  2: 'Mã riêng',
  1: 'Mã chung'
}

export const TYPE_FEE_PRIVATE = 2
export const TYPE_FEE_PUBLIC = 1

// PHƯƠNG THỨC PHỤ PHÍ. 1: THÊM VÀO GIÁ, 2: GIẢM GIÁ
export const TYPE_METHOD_FEE = {
  1: 'Thêm vào giá',
  2: 'Giảm giá'
}

export const TYPE_METHOD_FEE_ADD = 1
export const TYPE_METHOD_FEE_SUB = 2

export const ARRAY_STATUS_BILL_SEARCH = [
  { value: 0, label: 'Khởi tạo chờ xác nhận' },
  { value: 1, label: 'Đã thanh toán' },
  { value: 2, label: 'Thất bại' },
  { value: 3, label: 'Chờ thanh toán' },
  { value: 4, label: 'Đã hủy' }
]

export const STATUS_PUSH_MISA = {
  SUCCESS: 1, // Đã đẩy thành công
  ERROR: 2, // Đã đẩy lỗi - Đã đẩy nhưng có lỗi
  NOT_PUSH: 0, // Chưa đẩy
  WAITING: 3, // Đang chờ đẩy
  ERROR_DATA: 4 // Lỗi dữ liệu - Dữ liệu không hợp lệ - không đẩy
}

export const TEXT_STATUS_PUSH_MISA = {
  1: 'Đã đẩy thành công',
  2: 'Đã đẩy nhưng có lỗi',
  0: 'Chưa đẩy',
  3: 'Đang chờ đẩy',
  4: ' Dữ liệu không hợp lệ - không đẩy'
}
