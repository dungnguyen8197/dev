import axiosInstance from "middleware/axios";

const login = ({ user_name, password }) =>
  axiosInstance.post("/admin_cms/login", { user_name, password });

export { login };
