import { useDispatch, useSelector } from "react-redux";
import { hideSnack } from "redux/actions/snackAction";
import { useEffect } from "react";

export default function useSnack() {
  const dispatch = useDispatch();
  const snack = useSelector((state) => state.snack);
  const handleClose = () => dispatch(hideSnack());
  useEffect(() => () => dispatch(hideSnack()), []);

  return { open: snack.open, type: snack.type, message: snack.message, handleClose };
}
