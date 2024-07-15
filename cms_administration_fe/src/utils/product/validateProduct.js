export function setRules() {
  return {
    name: [
      { required: true, message: ('Tên sản phẩm không được để trống'), trigger: 'blur' },
      { min: 3, max: 255, message: ('Tên sản phẩm tối thiểu 3 kí tự'), trigger: 'blur' }
    ],
    cost: [
      { required: true, message: ('input_name_cost'), trigger: 'blur' }
    ],
    tag_ids: [
      { required: true, message: ('Tag không được để trống'), trigger: 'blur' }
    ],
    // desc: [
    //   { required: true, message: 'Vui lòng nhập mô tả', trigger: 'blur' },
    //   { min: 10, message: 'Mô tả phải nhập ít nhất 10 ký tự', trigger: 'blur' }
    // ],
    product_code: [
      { required: true, message: ('Mã sản phẩm không được để trống'), trigger: 'blur' }
    ],
    product_code_shop: [
      { required: true, message: 'Mã nhà cung cấp không được để trống', trigger: 'blur' }
    ],
    price: [
      { required: true, message: 'Giá niêm yết không được để trống', trigger: 'blur' }
    ],
    listImage: [
      { required: true, message: 'Ảnh không được để trống', trigger: 'blur' }
    ],
    category_id: [
      { required: true, message: 'Danh mục không được để trống', trigger: 'blur' }
    ],
    shop_id: [
      { required: true, message: 'Nhà cung cấp không được để trống', trigger: 'blur' }
    ],
    trademark_id: [
      { required: true, message: 'Thương hiệu không được để trống', trigger: 'blur' }
    ],
    product_tags: [
      { required: true, message: 'Nhãn hàng không được để trống', trigger: 'blur' }
    ],
    weight: [
      { required: true, message: 'Trọng lượng không được để trống', trigger: 'blur' }
    ]
    // product_tags: [
    //   { required: true, message: ('valid_tag'), trigger: 'blur' },
    //   { validator: checkTagIds, trigger: 'blur' }
    // ]
  }
}

export function setRulesOffline() {
  return {
    name: [
      { required: true, message: ('input_name_product'), trigger: 'blur' },
      { min: 3, max: 255, message: ('input_name_product_2'), trigger: 'blur' }
    ],
    cost: [
      { required: true, message: ('input_name_cost'), trigger: 'blur' }
    ],
    // desc: [
    //   { required: true, message: 'Vui lòng nhập mô tả', trigger: 'blur' },
    //   { min: 10, message: 'Mô tả phải nhập ít nhất 10 ký tự', trigger: 'blur' }
    // ],
    product_code: [
      { required: true, message: ('valid_vga'), trigger: 'blur' }
    ],
    price: [
      { required: true, message: ('valid_price'), trigger: 'blur' }
    ],
    price_sale: [
      { required: true, message: ('valid_price'), trigger: 'blur' }
    ],
    // listImage: [
    //   { required: true, message: ('valid_image'), trigger: 'blur' }
    // ],
    // category_id: [
    //   { required: true, message: ('valid_cate'), trigger: 'blur' }
    // ],
    shop_id: [
      { required: true, message: ('valid_shop'), trigger: 'blur' }
    ]
    // trademark_id: [
    //   { required: true, message: ('valid_trade'), trigger: 'blur' }
    // ],
    // weight: [
    //   { required: true, message: ('valid_weight'), trigger: 'blur' }
    // ],
    // product_tags: [
    //   { required: true, message: ('valid_tag'), trigger: 'blur' },
    //   { validator: checkTagIds, trigger: 'blur' }
    // ]
  }
}

// function checkTagIds(rule, value, callback) {
//   console.log(value, 123123)
//   if (value.length === 0) {
//     return callback(new Error(('valid_tag')))
//   } else {
//     callback()
//   }
// }
