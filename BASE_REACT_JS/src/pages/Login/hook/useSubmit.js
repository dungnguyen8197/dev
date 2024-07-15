import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { login } from "api/login";
import { setToken, setRefreshToken } from "utils/storage";
import { useMutation } from "react-query";

export default function useSubmit() {
  const navigate = useNavigate();

  const { mutateAsync } = useMutation("sign-in", (values) => login(values), {
    onSuccess: ({ data }) => {
      setToken(data.token);
      setRefreshToken(data.refreshToken);
      navigate("/dashboard");
    },
  });

  const formik = useFormik({
    initialValues: {
      user_name: "",
      password: "",
    },
    validationSchema: Yup.object({
      user_name: Yup.string().required("Vui lòng nhập tên đăng nhập"),
      password: Yup.string().required("Vui lòng nhập mật khẩu"),
    }),
    onSubmit: (values) => {
      mutateAsync(values);
    },
  });

  return { formik };
}
