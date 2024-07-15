// import moment from 'moment'
import moment from 'moment/moment'

export function kFormatter(num) {
  return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
}

export function formatNumber(value, dot = '.') {
  const val = (value / 1).toFixed().replace('.', ',')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, dot)
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

export function convertDateString(inputFormat, from = 'dd/mm/yyyy', to = 'yyyy-mm-dd') {
  if (from === 'dd/mm/yyyy' && to === 'yyyy-mm-dd') {
    const d = inputFormat.split('/')
    const dateString = `${d[2]}-${d[1]}-${d[0]}`
    return dateString
  }
}

export function convertMilliSecondsToDateFormat(milli, format = 'DD/MM/YYYY') {
  const date = new Date(milli) // Date 2011-05-09T06:08:45.178Z
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  if (format === 'DD/MM/YYYY') {
    return `${day}/${month}/${year}`
  } else if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`
  }
}

export function convertDBDateTime(input) {
  const dt = input.split(' ')
  let dateTime = dt[0].substr(0, 10).split('-')
  dateTime = dateTime[2] + '-' + dateTime[1] + '-' + dateTime[0]
  const result = dt[1] + ' ' + dateTime
  return result
}

export function convertDate(inputFormat, format = 'DD/MM/YYYY') {
  function pad(s) {
    return (s < 10) ? '0' + s : s
  }

  const d = new Date(inputFormat)
  if (format === 'DD/MM/YYYY') {
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
  } else if (format === 'YYYY-MM-DD') {
    return [pad(d.getFullYear()), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
  }
}

export function convertDate1(inputFormat, format = 'YYYY-MM-DD') {
  function pad(s) {
    return (s < 10) ? '0' + s : s
  }
  const d = new Date(inputFormat)
  if (format === 'YYYY-MM-DD') {
    return [pad(d.getFullYear()), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
  }
}
// export function convertDateTime(inputFormat, format = 'DD/MM/YYYY HH:ss ') {
//   const moment = require('moment');
//   const data = moment(inputFormat).format(format);
//   return data;
// }
export function convertDateTime(inputFormat, format = 'DD/MM/YYYY') {
  function pad(s) {
    return (s < 10) ? '0' + s : s
  }

  const d = new Date(inputFormat)
  const time = [pad(d.getHours()), pad(d.getMinutes())].join(':')
  let day = ''
  if (format === 'DD/MM/YYYY') {
    day = [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
  } else if (format === 'YYYY-MM-DD') {
    day = [pad(d.getFullYear()), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
  }
  return `${time} ${day}`
}

export function convertDateTimeSecond1(inputFormat, format = 'DD/MM/YYYY') {
  function pad(s) {
    return (s < 10) ? '0' + s : s
  }

  const d = new Date(inputFormat)
  const time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':')
  let day = ''
  if (format === 'DD/MM/YYYY') {
    day = [pad(d.getFullYear()), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
  } else if (format === 'YYYY-MM-DD') {
    day = [pad(d.getFullYear()), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
  }
  return `${day} ${time} `
}

export function convertDateTimeSecond(inputFormat, format = 'DD/MM/YYYY') {
  function pad(s) {
    return (s < 10) ? '0' + s : s
  }

  const d = new Date(inputFormat)
  const time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':')
  let day = ''
  if (format === 'DD/MM/YYYY') {
    day = [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('-')
  } else if (format === 'YYYY-MM-DD') {
    day = [pad(d.getFullYear()), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
  }
  return `${time} ${day}`
}

export function convertDateTimeString(inputFormat, format = 'HH:mm:ss DD-MM-YYYY') {
  function pad(s) {
    return (s < 10) ? '0' + s : s
  }

  const d = new Date(inputFormat)
  const time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':')
  let day = ''
  if (format === 'HH:mm:ss DD-MM-YYYY') {
    day = [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('-')
  } else if (format === 'YYYY-MM-DD') {
    day = [pad(d.getFullYear()), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
  }
  return `${time} ${day}`
}

export function convertDateTimeSecond2(inputFormat, format = 'DD/MM/YYYY', is_utc = false) {
  function pad(s) {
    return (s < 10) ? '0' + s : s
  }

  const d = new Date(inputFormat)
  const hour = is_utc ? d.getUTCHours() : d.getHours()
  const minute = is_utc ? d.getUTCMinutes() : d.getMinutes()
  const time = [pad(hour), pad(minute), pad(d.getSeconds())].join(':')
  let day = ''
  if (format === 'DD/MM/YYYY') {
    day = [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('-')
  } else if (format === 'YYYY-MM-DD') {
    day = [pad(d.getFullYear()), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
  }
  return `${time} ${day}`
}

export function convertDatedString(inputFormat, format = 'YYYY-MM-DD') {
  function pad(s) {
    return (s < 10) ? '0' + s : s
  }

  const d = new Date(inputFormat)
  // const time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':')
  let day = ''
  if (format === 'DD/MM/YYYY') {
    day = [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
  } else if (format === 'YYYY-MM-DD') {
    day = [pad(d.getFullYear()), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
  }
  return `${day}`
}

export function renderStringDate(s) {
  return (s < 10) ? '0' + s : s
}

export function formatNumberOrNull(value) {
  if (value == null) {
    return null
  }
  const val = (value / 1).toFixed().replace('.', ',')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// export function convertTime(value) {
//   if (value == null) {
//     return 0
//   }
//   return moment(value).subtract(7, 'hour').format('HH:mm:ss DD/MM/yyyy')
// }
export function convertTimestampToDateTime(convertTimestampToDateTime, format = 'DD/MM/YYYY') {
  if (convertTimestampToDateTime) {
    return moment(convertTimestampToDateTime).format(format)
  }
}

export function convertNumberToPrice(value) {
  const val = (value / 1).toFixed().replace('.', ',')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function convertDateTimeUTC(inputFormat, format = 'DD/MM/YYYY') {
  function pad(s) {
    return (s < 10) ? '0' + s : s
  }

  const d = new Date(inputFormat)
  if (format === 'DD/MM/YYYY') {
    return [pad(d.getUTCHours()), pad(d.getUTCMinutes())].join(':') + ' ' + [pad(d.getUTCDate()), pad(d.getUTCMonth() + 1), d.getUTCFullYear()].join('/')
  } else if (format === 'YYYY-MM-DD') {
    return [pad(d.getUTCHours()), pad(d.getUTCMinutes())].join(':') + ' ' + [pad(d.getUTCFullYear()), pad(d.getUTCMonth() + 1), pad(d.getUTCDate())].join('-')
  }
}

export function convertTeeTimeToDateTime(dateTime) {
  const d = dateTime.split(' ')
  const arrayTime = d[1].split(':')
  const timeString = `${arrayTime[0]}:${arrayTime[1]}`
  return timeString
}

export function convertToDateTimeString(input, format = 'HH:mm DD/MM/YYYY') {
  return moment(input).format(format)
}

export function formatDate(inputFormat, format = 'DD-MM-YYYY HH:mm:ss') {
  if (inputFormat) {
    return moment(inputFormat).format(format)
  }
}

export function upperCase(value) {
  const normal = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\Đ]/g, 'D')
  return normal.toUpperCase()
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
export function setArraySelect(golfers) {
  const array = []
  if (golfers.length > 0) {
    golfers.map(golfer => {
      const vga = (golfer.id_display) ? golfer.id_display : golfer.id
      const name = `vID${vga} - ${golfer.fullname} (${golfer.nickname})`
      const item = { value: golfer.id, label: name }
      array.push(item)
    })
  }
  return array
}
