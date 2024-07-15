import * as constants from "redux/constants";

export const showSnack = ({ type, message }) => ({
  type: constants.SHOW_SNACK,
  payload: { type, message },
});

export const hideSnack = () => ({
  type: constants.HIDE_SNACK,
});
