export function convertIsPayToString(isPay) {
  switch (isPay) {
    case 0:
      return 'Chưa thanh toán'
    case 1:
      return 'Đã thanh toán'
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
      return { className: 'success', text: 'Đã nhận phản hồi PVI' }
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
    default:
      return 'APP WGHN'
  }
}

export function convertTypeAccount(TypeAccount) {
  switch (TypeAccount) {
    case -2:
      return { className: 'warning', text: 'Trial Member' }
    case 0:
      return { className: 'warning', text: 'Non Member' }
    case 1:
      return { className: 'info', text: 'Member' }
    case 2:
      return { className: 'primary', text: 'Member VIP' }
    case 3:
      return { className: 'success', text: 'Member LUXURY' }
    case 4:
      return { className: 'success', text: 'Member Profesional' }
    case 5:
      return { className: 'info', text: 'Member Junior' }
    case 6:
      return { className: 'info', text: 'Member MGA' }
    case 7:
      return { className: 'info', text: 'Member MGA' }
    case 10:
      return { className: 'info', text: 'Member Reference' }
    case 11:
      return { className: 'primary', text: 'Member Senior' }
    case 12:
      return { className: 'success', text: 'Member Infinite' }
    default:
      return { className: 'info', text: 'N/A' }
  }
}

export function convertIsProPlayer(isProPlayer) {
  switch (isProPlayer) {
    case 0:
      return { className: 'info', text: 'Golfer Nghiệp Dư' }
    default:
      return { className: 'success', text: 'Golfer PRO' }
  }
}

export function convertMembership(Membership) {
  switch (Membership) {
    // case -2:
    //   return { className: 'warning', text: 'Trial Member' }
    case 0:
      return { className: 'warning', text: 'Non Member' }
    case 1:
      return { className: 'info', text: 'Member' }
    case 2:
      return { className: 'primary', text: 'Member VIP' }
    case 3:
      return { className: 'success', text: 'Member LUXURY' }
    // case 4:
    //   return { className: 'success', text: 'Member Profesional' }
    // case 5:
    //   return { className: 'info', text: 'Member Junior' }
    // case 6:
    //   return { className: 'info', text: 'Member MGA' }
    // case 7:
    //   return { className: 'info', text: 'Member MGA' }
    // case 10:
    //   return { className: 'info', text: 'Member Reference' }
    // case 11:
    //   return { className: 'primary', text: 'Member Senior' }
    case 12:
      return { className: 'success', text: 'Member Infinite' }
    default:
      return { className: 'info', text: 'N/A' }
  }
}
