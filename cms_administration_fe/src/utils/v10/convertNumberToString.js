export function convertTypeString(typeNumber) {
  switch (typeNumber) {
    case 1:
      return 'Thanh toán trực tiếp'
    case 2:
      return 'Thanh toán Online'
    case 3:
      return 'Thanh toán chuyển khoản'
    case 4:
      return 'Thanh toán point'
    case 11:
      return 'Thanh toán SACOM'
    case 10:
      return 'Thanh toán VISA'
    case 12:
      return 'Thanh toán CK bằng Code'
    case 13:
      return 'Thanh toán NAB'
    default:
      return 'Chưa thanh toán'
  }
}

export function renderClassType(typeNumber) {
  switch (typeNumber) {
    case 0:
      return 'info'
    default:
      return 'success'
  }
}

export function renderClassStatus(status) {
  switch (status) {
    case 2:
      return 'success'
    case 3:
      return 'success'
    case 4:
      return 'warning'
    case 5:
      return 'danger'
    default:
      return 'info'
  }
}

export function renderTimeFrameSelect(time_frame_select) {
  switch (time_frame_select) {
    case 1:
      return 'Sáng'
    case 2:
      return 'Chiều'
    case 3:
      return 'Tối'
    default:
      return ''
  }
}

export function convertStatusString(status) {
  switch (status) {
    case 1:
      return 'Tạo flight'
    case 2:
      return 'Đã xác nhận'
    case 4:
      return 'Hủy đúng hạn'
    case 5:
      return 'Hủy sai hạn'
    case 6:
      return 'Xác nhận booking'
    default:
      return 'Đã hoàn thành'
  }
}

export function convertHIOToString(type_hio_buy) {
  switch (type_hio_buy) {
    case 1:
      return { typeName: 'success', textName: 'Gói 100 triệu' }
    case 2:
      return { typeName: 'warning', textName: 'Gói 200 triệu' }
    default:
      return { typeName: 'info', textName: 'Không kèm BH' }
  }
}
