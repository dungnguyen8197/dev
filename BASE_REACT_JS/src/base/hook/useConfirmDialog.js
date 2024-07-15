import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideDialog } from "redux/actions/dialogAction";

export default function useConfirmDialog() {
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.dialog);

  useEffect(() => () => dispatch(hideDialog()), []);

  return {
    open: dialog.open,
    onClose: dialog.onClose,
    onSubmit: dialog.onSubmit,
    submitTitle: dialog.submitTitle,
    closeTitle: dialog.closeTitle,
    title: dialog.title,
    content: dialog.content,
    isLoading: dialog.isLoading,
    submitColor: dialog.submitColor,
  };
}
