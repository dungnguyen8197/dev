export function convertIsPayToString(isPay) {
  switch (isPay) {
    case 0:
      return 'Chưa xác nhận gửi PVI'
    case 1:
      return 'Đã xác nhận gửi PVI'
    default:
      return 'Không xác định'
  }
}

export function convertStatusToString(status) {
  switch (status) {
    case 0:
      return 'Chưa khởi tạo xong'
    case 1:
      return 'Đã nhận phản hồi từ PVI'
    case 2:
      return 'Đang chờ phản hồi từ PVI'
    default:
      return 'Không xác định'
  }
}

export function convertIsSendPviToString(isSendPvi) {
  switch (isSendPvi) {
    case 1:
      return { className: 'success', text: 'Đã gửi đơn qua PVI' }
    case 2:
      return { className: 'primary', text: 'Đã đẩy vào hàng chờ' }
    default:
      return { className: 'warning', text: 'Chưa gửi thông tin' }
  }
}

export function convertSourceBuyToString(sourceBuy) {
  switch (sourceBuy) {
    case 2:
      return 'CMS SPORT'
    case 3:
      return 'CMS BOOKING'
    case 4:
      return 'AGENT'
    case 6:
      return 'ZALO'
    default:
      return 'APP WGHN'
  }
}

export function convertSourcePayToString(sourceBuy) {
  switch (sourceBuy) {
    case 1:
      return 'CMS '
    case 2:
      return 'Chuyển khoản'
    default:
      return ''
  }
}
