export function convertDataSelect(data, keyValue, keyLabel) {
  const array = []
  if (data.length > 0) {
    data.map(value => {
      const item = { value: value[keyValue], label: value[keyLabel], data: value }
      array.push(item)
    })
  }
  return array
}

export function convertDataDistrict(objectDetail, arrayDistrict) {
  if (Object.keys(objectDetail).length > 0) {
    const golferAddress = objectDetail.golfer_address
    if (golferAddress) {
      return arrayDistrict.filter(district => district.DISTRICT_ID === golferAddress.district_viettel_post_id)[0]
    } else {
      return {}
    }
  }
}

export function convertWards(objectDetail, arrayWards) {
  if (Object.keys(objectDetail).length > 0) {
    const golferAddress = objectDetail.golfer_address
    if (golferAddress) {
      return arrayWards.filter(district => district.WARDS_ID === golferAddress.township_viettel_post_id)[0]
    } else {
      return {}
    }
  }
}
