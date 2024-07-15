import { removeAdmin } from "api/admin";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import {
  hideDialog,
  loadingDialog,
  showDialog,
  stopLoadingDialog,
} from "redux/actions/dialogAction";

export default function useRemove(list) {
  const dispatch = useDispatch();
  const remove = useQuery("remove-account", (values) => removeAdmin(values));

  const handleRemove = (id) => {
    dispatch(loadingDialog());
    remove
      .mutateAsync(id)
      .then(() => {
        list.refetch();
        dispatch(hideDialog());
      })
      .catch(() => dispatch(stopLoadingDialog()));
  };

  const handleShowRemove = (row) => {
    dispatch(
      showDialog({
        onSubmit: () => handleRemove(row.id),
        content: `Bạn xác nhận xóa tài khoản <b>${row.user_name}</b> ?`,
        submitTitle: "Xóa",
        title: "Xóa tài khoản?",
        closeTitle: "Hủy",
        onClose: () => dispatch(hideDialog()),
      })
    );
  };

  return { remove, handleShowRemove };
}
