/* eslint-disable default-param-last */
import * as constants from "redux/constants";

const initialState = {
  message: "",
  open: false,
  type: "success",
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case constants.SHOW_SNACK:
      return { ...initialState, ...payload, open: true };
    case constants.HIDE_SNACK:
      return { ...state, open: false };
    default:
      return state;
  }
};

export default reducer;
