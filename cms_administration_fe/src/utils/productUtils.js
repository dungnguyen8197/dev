function format_product_params(list_size = []) {
  let sizes = []
  let colors = []
  list_size.forEach((x) => {
    // _m_size[x.param_first] = 1;
    // _m_color[x.param_second] = 1;
    // console.log('..........list size : ', x);
    if (x.param_second) {
      colors.push(x.param_second)
    }
    if (x.param_first) {
      sizes.push(x.param_first)
    }
  })

  sizes = filterValueSemiler(sizes)
  colors = filterValueSemiler(colors)
  return {
    list_attr1: sizes,
    list_attr2: colors
  }
}

/**
 * Loai nhung phan tu giong nhau
 * @param {*} ars
 */
function filterValueSemiler(ars = []) {
  const list = []
  for (const value of ars) {
    const item = list.find((v) => v === value)
    if (!item) {
      list.push(value)
    }
  }
  return list
}

export { format_product_params }
