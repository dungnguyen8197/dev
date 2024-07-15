import * as constants from "redux/constants";

export const showDialog = (payload) => ({
  type: constants.SHOW_DIALOG,
  payload,
});

export const loadingDialog = () => ({
  type: constants.LOADING_DIALOG,
});

export const stopLoadingDialog = () => ({
  type: constants.STOP_LOADING_DIALOG,
});

export const hideDialog = () => ({
  type: constants.HIDE_DIALOG,
});
