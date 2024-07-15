import { useDispatch, useSelector } from "react-redux";
import { hideDialog } from "redux/actions/dialogAction";

export default function useSnack() {
  const dispatch = useDispatch();
  const { isShow, type, message } = useSelector((state) => state.dialog);

  const handleClose = () => {
    dispatch(hideDialog());
  };

  return { isShow, type, message, handleClose };
}
