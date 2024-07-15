const listService = [
  {
    value: 1, label: 'SHOP', type: 'shop', commodity_codes: [
      { value: 1, label: 'CUP 1' },
      { value: 2, label: 'CUP 2' },
      { value: 3, label: 'CUP 3' },
      { value: 4, label: 'CUP 4' }
    ]
  },
  {
    value: 2, label: 'HIO', type: 'hio', commodity_codes: [
      { value: 1, label: 'Quà giải 1' },
      { value: 2, label: 'Quà giải 2' },
      { value: 3, label: 'Quà giải 3' },
      { value: 4, label: 'Quà giải 4' }
    ]
  },
  {
    value: -1, label: 'Sản phẩm khác', type: 'other_service', commodity_codes: [
      { value: 1, label: 'MC 1' },
      { value: 2, label: 'MC 2' },
      { value: 3, label: 'MC 3' },
      { value: 4, label: 'MC 4' }
    ]
  }

]

const listOrderType = [
  { value: 1, label: 'Đơn thường' },
  { value: 2, label: 'Đơn Outing' }
]

const listTypeHole = [
  { value: 9, label: '9 lỗ' },
  { value: 18, label: '18 lỗ' },
  { value: 27, label: '27 lỗ' }
]

const listHIO = [
  { value: 0, label: 'Không mua' },
  { value: 1, label: 'D20' },
  { value: 2, label: 'D100' },
  { value: 3, label: 'D200' }
]

// const listMember = [
//   { value: -2, label: 'Newbie' },
//   { value: 0, label: 'Normal' },
//   { value: 1, label: 'Vip1' },
//   { value: 2, label: 'Vip2' },
//   { value: 3, label: 'Premium' },
//   { value: 4, label: 'PRO' },
//   { value: 5, label: 'Hội viên trẻ' },
//   { value: 6, label: 'Ban chấp hành' },
//   // { value: 7, label: 'Danh du' },
//   // { value: 8, label: 'Nhà tài trợ' },
//   { value: 7, label: 'Hiệp hội golf' },
//   { value: 8, label: 'Member sân' },
//   { value: 9, label: 'Member' },
//   { value: 10, label: 'Hội viên trọng tài' },
//   { value: 11, label: 'Senior' },
//   { value: 12, label: 'Infinite' },

//   { value: 99, label: 'Free' }

// ]
const listMember = [
  { value: 0, label: 'Non Member' },
  { value: 1, label: 'Member' },
  { value: 2, label: 'VIP' },
  { value: 3, label: 'Luxury' },
  { value: 4, label: 'Infinite' }
]
const listGender = [
  { value: 0, label: 'Nam' },
  { value: 1, label: 'Nữ' }
]

const listAge = [
  { value: 1, label: 'Dưới 18' },
  { value: 2, label: 'Từ 18 đến 50' },
  { value: 3, label: 'Trên 50' }
]

const SCREEN_APP = [
  { value: 'ShopProductDetailView', label: 'Sản phẩm chi tiết shop' },
  { value: 'ShopVPhone', label: 'Màn hình vSim' },
  { value: 'InsuranceHome', label: 'Màn hình bảo hiểm HIO' },
  { value: 'BookingHomeView', label: 'Màn hình Booking' },
  { value: 'ShopHomeView', label: 'Màn hình vShop' },
  { value: 'Travel', label: 'Màn hình vTravel' },
  { value: 'PointRechagerView', label: 'Màn hình nạp ví điểm thưởng' },
  { value: 'VNewsHotnewsDetail', label: 'Màn hình vNews chi tiết' },
  { value: 'VNewsMP4PlayerView', label: 'Màn hình vNews MP4' },
  { value: 'VNewsShortVideoList', label: 'Màn hình vNews Short Video' },
  { value: 'VNewsLive', label: 'Màn hình VNews Live' }
]
const TYPE_DETAIL_SCREEN = ['ShopProductDetailView', 'VNewsHotnewsDetail', 'VNewsMP4PlayerView', 'VNewsShortVideoList', 'VNewsLive']

const LIST_TYPE_CARD_SCB = [
  { value: 1, label: 'Thẻ Infinite - Miễn Phí' },
  { value: 2, label: 'Thẻ World MC - Giảm Phí' },
  { value: 3, label: 'Thẻ World MC - Miễn Phí' },
  { value: 4, label: 'Thẻ VIP - Miễn Phí' },
  { value: 5, label: 'Thẻ Infinite FLC - Miễn phí' }
]
const CUSTOMER_TYPE = {
  1: 'Khách thường',
  // 2: 'Khách đại lý',
  3: 'Khách member',
  4: 'Khách inbound',
  5: 'Khách memberguest',
  6: 'Khách Lady',
  7: 'Khách Junior',
  8: 'Khách Senior',
  9: 'Khách giá visitor'
}
const SOURCE_BANK = {
  VIETIN: 5, // Vietin Bank 5
  NAB: 4, // NAB Bank 4
  SCB: 6, // SCB Bank 6,
  BIDV: 7
}

module.exports = {
  typeAccounts: [
    {
      label: 'Tất cả',
      value: -1
    },
    {
      label: 'Non Member',
      value: 0
    },
    {
      label: 'Member',
      value: 1
    }, {
      label: 'Member Vip',
      value: 2
    },
    {
      label: 'Member Luxury',
      value: 3
    },
    {
      label: 'Member Infinite',
      value: 12
    }
  ],
  AccountOptionForm: [
    {
      label: 'Member',
      value: 1
    },
    {
      label: 'Member VIP',
      value: 2
    },
    {
      label: 'Member LUXURY',
      value: 3
    }
  ],
  HistoryUserOrderVgaOption: [
    {
      label: 'Thanh toán mã',
      value: 1
    },
    {
      label: 'Thanh toán mã Sale',
      value: 2
    },
    {
      label: 'Thanh toán mã free',
      value: 3
    }
  ],
  typeMembership: [
    {
      label: 'Trial Member',
      value: -2
    },
    {
      label: 'Member Profesional',
      value: 4
    },
    {
      label: 'Member Junior',
      value: 5
    },
    {
      label: 'Member MGA',
      value: 6
    },
    {
      label: 'Member Reference',
      value: 10
    },
    {
      label: 'Member Senior',
      value: 11
    }
  ],
  listService,
  listOrderType,
  listTypeHole,
  listHIO,
  listMember,
  listGender,
  listAge,
  SCREEN_APP,
  TYPE_DETAIL_SCREEN,
  LIST_TYPE_CARD_SCB,
  CUSTOMER_TYPE,
  SOURCE_BANK
}

