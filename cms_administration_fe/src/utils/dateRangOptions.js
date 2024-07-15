'use strict'

module.exports = {
  pickerOptions: [
    {
      text: '7 ngày trước',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '30 ngày trước',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '90 ngày trước',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    }
  ],
  selectOptions: [
    {
      value: -1,
      label: 'Tất cả'
    },
    {
      value: 0,
      label: 'Chưa thanh toán'
    },
    {
      value: 1,
      label: 'Đã thanh toán'
    },
    {
      value: 2,
      label: 'Thanh toán lỗi'
    }
  ]
}
