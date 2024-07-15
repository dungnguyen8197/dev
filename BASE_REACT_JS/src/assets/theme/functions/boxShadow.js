/* eslint-disable default-param-last */
import rgba from "assets/theme/functions/rgba";

function boxShadow(offset = [], radius = [], color, opacity, inset = "") {
  const [x, y] = offset;
  const [blur, spread] = radius;

  return `${inset} ${x}px ${y}px ${blur}px ${spread}px ${rgba(color, opacity)}`;
}

export default boxShadow;
