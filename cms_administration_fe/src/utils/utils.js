import axios from '@/utils/axios'

export function get_ranger_time_yesterday() { // lay khoang tgian ngay hom  qua
  const start_date = new Date()
  start_date.setHours(0)
  start_date.setMinutes(0)
  start_date.setSeconds(0)
  start_date.setDate(start_date.getDate() - 1)
  // console.log('..........ngay hom qua bat dau tu ', moment(start_date).format('hh:mm DD/MM/YYYY'), start_date.getTime());
  const end_date = new Date()
  end_date.setHours(23)
  end_date.setMinutes(59)
  end_date.setSeconds(50)
  end_date.setDate(end_date.getDate() - 1)
  // console.log('..........ngay hom qua ket thuc tu ', moment(end_date).format('hh:mm DD/MM/YYYY'), end_date.getTime());
  // get_ranger_time_same_date_last_week(start_date.getTime(),end_date.getTime());
  return [start_date.getTime(), end_date.getTime()]
}

export function get_ranger_time_today() { // dau ngay den gio
  const start_date = new Date()
  start_date.setHours(0)
  start_date.setMinutes(0)
  start_date.setSeconds(0)
  // console.log('..........ngay hom nay bat dau tu ', moment(start_date).format('hh:mm DD/MM/YYYY'), start_date.getTime());
  const end_date = Date.now()
  // end_date.setHours(23);
  // end_date.setMinutes(59);
  // end_date.setSeconds(50);
  // console.log('..........ngay hom nay ket thuc tu ', moment(end_date).format('hh:mm DD/MM/YYYY'), end_date.getTime());
  return [start_date.getTime(), end_date]
}

// dau thang den gio
export function get_ranger_time_month() { // khoang thoi gian dau thang den gio
  const start_date = new Date()
  start_date.setHours(0)
  start_date.setMinutes(0)
  start_date.setSeconds(0)
  start_date.setDate(1)
  //   console.log('..........thang nay bat dau tu ', moment(start_date).format('hh:mm DD/MM/YYYY'), start_date.getTime())
  const end_date = Date.now()
  return [start_date.getTime(), end_date]
}

export function get_ranger_time_last_month() { // khoang thoi gian thang truoc
  const start_date = new Date()
  start_date.setHours(0)
  start_date.setMinutes(0)
  start_date.setSeconds(0)
  start_date.setDate(1)
  start_date.setMonth(start_date.getMonth() - 1)
  // console.log('..........thang nay bat dau tu ', moment(start_date).format('hh:mm DD/MM/YYYY'), start_date.getTime());
  const end_date = new Date()
  end_date.setHours(23)
  end_date.setMinutes(59)
  end_date.setSeconds(59)
  end_date.setDate(0)
  // console.log('..........thang truocket thuc tu ', moment(start_date).format('hh:mm DD/MM/YYYY'), start_date.getTime());
  return [start_date.getTime(), end_date.getTime()]
}

export function get_ranger_time_same_date_last_week() { // lay khoang tgian cung ngay tuan truoc - 7 ngay
  const ranger = get_ranger_time_yesterday()
  const start = new Date(ranger[0])
  start.setDate(start.getDate() - 7)
  // console.log('...........cung ngay bat dau tuan truoc ', moment(start).format('hh:mm DD/MM/YYYY'), start.getTime())
  const end = new Date(ranger[1])
  end.setDate(end.getDate() - 7)
  // console.log('...........cung ngay ket thuc tuan truoc ', moment(end).format('hh:mm DD/MM/YYYY'), end.getTime());
  return [start.getTime(), end.getTime()]
}

/**
   * 7 ngay qua
   * @returns
   */
export function get_ranger_time_week() { // khoang thoi gian 7 ngay qua
  const start_date = new Date()
  start_date.setHours(0)
  start_date.setMinutes(0)
  start_date.setSeconds(0)
  start_date.setDate(start_date.getDate() - 7)
  // console.log('..........thang nay bat dau tu ', moment(start_date).format('hh:mm DD/MM/YYYY'), start_date.getTime());
  const end_date = Date.now()
  return [start_date.getTime(), end_date]
}

export function isValidDate(d) {
  return !isNaN(new Date(d))
}

/**
 * Lay cac quyen trong menu
 * @param {*} account_id
 * @param {*} menu_id
 * @param {*} okCallback
 * @param {*} errCallback
 * @returns
 */
export function get_list_permission(email, menu_id, okCallback = null, errCallback = null) {
  try {
    axios({
      url: `https://shop.vcallid.com/api/public/supplier/get_permisson_menu?email=${email}&menu_id=${menu_id}`,
      method: 'get'
    }).then(res => {
      const { error, data } = res
      if (error === 0) {
        // let {is_supper_admin,is_add,is_export,is_delete,is_edit,is_view} = data
        // is_supper_admin = parseInt(is_supper_admin)
        if (okCallback) {
          okCallback(data)
        }
      }
    }).catch(err => {
      if (errCallback) {
        errCallback(err)
      }
    })
  } catch (error) {
    // return null
  }
}
