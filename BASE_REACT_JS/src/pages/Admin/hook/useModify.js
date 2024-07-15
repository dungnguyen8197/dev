import { createAdmin, updateAdmin } from "api/admin";
import { useFormik } from "formik";
import { useState } from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { showSnack } from "redux/actions/snackAction";
import * as Yup from "yup";

export default function useModify(list) {
  const [title, setTitle] = useState("Thêm tài khoản");
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [submitTitle, setSubmitTitle] = useState("Thêm");
  const [closeTitle, setCloseTitle] = useState("Hủy");
  const [isAdd, setAdd] = useState(true);
  const dispatch = useDispatch();

  const create = useMutation("create-admin", (values) => createAdmin(values));
  const update = useMutation("update-admin", (values) => updateAdmin(values, values.id));

  const formik = useFormik({
    initialValues: {
      user_name: "",
      phone: "",
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      user_name: Yup.string().required("Vui lòng nhập tên đăng nhập"),
      phone: Yup.string().required("Vui lòng nhập số điện thoại"),
      name: Yup.string().required("Vui lòng nhập tên"),
      email: Yup.string().required("Vui lòng nhập email"),
      ...(isAdd && {
        password: Yup.string().required("Vui lòng nhập mật khẩu"),
        confirm_password: Yup.string().oneOf(
          [Yup.ref("password"), null],
          "Xác nhận mật khẩu không khớp"
        ),
      }),
    }),
    onSubmit: (values) => {
      if (isAdd)
        create.mutateAsync(values).then(() => {
          dispatch(showSnack({ type: "success", message: "Tạo tài khoản thành công" }));
          list.refetch();
          setIsShowDialog(false);
          formik.setTouched({}, false);
          formik.resetForm();
        });
      else
        update.mutateAsync(values).then(() => {
          dispatch(showSnack({ type: "success", message: "Cập nhật tài khoản thành công" }));
          list.refetch();
          setIsShowDialog(false);
          formik.setTouched({}, false);
          formik.resetForm();
        });
    },
  });

  const handleOpenAdd = () => {
    setSubmitTitle("Thêm");
    setAdd(true);
    setIsShowDialog(true);
  };

  const handleOpenModify = (row) => {
    formik.resetForm();
    formik.setFieldValue("id", row.id);
    formik.setFieldValue("user_name", row.user_name);
    formik.setFieldValue("phone", row.phone);
    formik.setFieldValue("name", row.name);
    formik.setFieldValue("email", row.email);
    formik.setFieldValue("password", row.password);
    formik.setFieldValue("confirm_password", row.password);

    setSubmitTitle("Cập nhật");
    setTitle("Cập nhật tài khoản");
    setAdd(false);
    setIsShowDialog(true);
  };

  const handleClose = () => {
    setIsShowDialog(false);
    formik.setTouched({}, false);
    formik.resetForm();
  };

  return {
    formik,
    title,
    setTitle,
    handleClose,
    isShowDialog,
    handleOpenAdd,
    handleOpenModify,
    submitTitle,
    setSubmitTitle,
    closeTitle,
    setCloseTitle,
    isAdd,
  };
}
