/* eslint-disable default-param-last */
import * as constants from "redux/constants";
import { emptyFunction } from "utils/utils";

const initialState = {
  open: false,
  onClose: emptyFunction,
  onSubmit: emptyFunction,
  submitTitle: "",
  closeTitle: "",
  submitColor: "info",
  title: "",
  content: "",
  isLoading: false,
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case constants.SHOW_DIALOG:
      return { ...initialState, ...payload, open: true };
    case constants.LOADING_DIALOG:
      return { ...state, isLoading: true };
    case constants.STOP_LOADING_DIALOG:
      return { ...state, isLoading: false };
    case constants.HIDE_DIALOG:
      return { ...state, open: false };
    default:
      return state;
  }
};

export default reducer;
