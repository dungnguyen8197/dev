import { combineReducers } from "redux";
import dialog from "./dialogReducer";
import snack from "./snackReducer";

const rootReducer = combineReducers({
  dialog,
  snack,
});

export default rootReducer;
