export function calculatorPriceSale(price, sale) {
  if (price === 0 || price === undefined || price === '') {
    return 0
  } else {
    return (price && sale) ? Math.round(price - sale * price / 100) : price
  }
}

export function setStateToString(state) {
  let object = {}
  switch (state) {
    case 3:
      object = { typeName: 'success', textName: ('convert_delivery') }
      break
    case 4:
      object = { typeName: 'danger', textName: ('convert_cancel_order') }
      break
    case 5:
      object = { typeName: 'danger', textName: ('return_order') }
      break
    default:
      object = { typeName: 'warning', textName: ('convert_not_delivery') }
  }
  return object
}
