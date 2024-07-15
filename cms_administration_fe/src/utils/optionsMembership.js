'use strict'

module.exports = {
  actionIsConfirm: [
    {
      label: 'Trạng thái',
      value: 0
    },
    {
      label: 'Xác nhận',
      value: 1
    },
    {
      label: 'Chờ xác nhận',
      value: 2
    },
    {
      label: 'Từ chối',
      value: 3
    }
  ],
  types: [
    {
      label: 'Loại giấy tờ',
      value: 0
    },
    {
      label: 'CMND',
      value: 1
    },
    {
      label: 'Passport',
      value: 2
    }
  ],
  optionsFilter: [
    {
      label: 'Chưa cập nhật giới tính',
      value: 0
    },
    {
      label: 'Đã cập nhật',
      value: 1
    }
  ],
  optionsSex: [
    {
      value: 0,
      label: 'Nam'
    },
    {
      value: 1,
      label: 'Nữ'
    },
    {
      value: 3,
      label: 'Không xác định'
    }
  ]
}
