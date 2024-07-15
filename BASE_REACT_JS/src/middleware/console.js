/* eslint-disable no-console */
import { IS_PRODUCT } from "config/keys";

if (IS_PRODUCT) {
  console.log = () => {};
  console.debug = () => {};
  console.warn = () => {};
  console.error = () => {};
}
