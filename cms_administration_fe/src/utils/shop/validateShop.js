export function setRules() {
  return {
    name: [
      { required: true, message: ('valid_shop_name'), trigger: 'blur' },
      { min: 3, max: 255, message: ('valid_shop_name_2'), trigger: 'blur' }
    ],
    phone: [
      { required: true, message: ('valid_phone'), trigger: 'blur' },
      { min: 10, max: 11, message: ('valid_phone_2'), trigger: 'blur' }
    ],
    user_name: [
      { required: true, message: ('valid_full_name_shop'), trigger: 'blur' },
      { min: 3, max: 255, message: ('valid_full_name_shop_2'), trigger: 'blur' }
    ],
    address: [
      { required: true, message: ('valid_address'), trigger: 'blur' }
    ]
  }
}
