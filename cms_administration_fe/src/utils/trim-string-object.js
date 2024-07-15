export const trim_string_object = (obj) => {
  Object.keys(obj).forEach(function(k) {
    obj[k] = typeof obj[k] === 'string' ? obj[k].trim() : obj[k]
  })
  return obj
}

