export function setArraySelect(golfers) {
  const array = []
  if (golfers.length > 0) {
    golfers.map(golfer => {
      const vga = (golfer.id_display) ? golfer.id_display : golfer.id
      const name = `vID${vga} - ${golfer.fullname} (${golfer.nickname})`
      const item = { value: golfer.id, label: name }
      array.push(item)
    })
  }
  return array
}

