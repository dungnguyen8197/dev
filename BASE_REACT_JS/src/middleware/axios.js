/* eslint-disable no-param-reassign */
import axios from "axios";
import { setToken, getRefreshToken, getToken, getLanguage } from "utils/storage";
import { baseURL } from "config/keys";
import store from "redux/store";
import { showSnack } from "redux/actions/snackAction";

const axiosInstance = axios.create({ baseURL, timeout: 10000 });

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getToken();
    const refreshToken = getRefreshToken();
    if (getLanguage()) config.params = { ...config.params, lang: getLanguage() };
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (refreshToken) config.headers["X-Token"] = refreshToken;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  async (response) => {
    if (response.data && response.data.error_code === 0) return response.data?.data;

    if (response.data?.error_code === 498) {
      const originalRequest = response.config;
      const token = getToken();
      originalRequest.headers.Authorization = `Bearer ${token}`;

      const refreshToken = getRefreshToken();
      const data = await axiosInstance.post("/admin/token", { refresh_token: refreshToken });

      originalRequest._retry = true;
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${data.data.token}`;
      setToken(data.data.token);

      return axiosInstance(originalRequest);
    }

    if (response.data?.error_code !== 1)
      store.dispatch(showSnack({ type: "error", message: response.data?.message }));
    return Promise.reject(response.data);
  },
  (error) => {
    store.dispatch(showSnack({ type: "error", message: error.message }));
    return Promise.reject(error);
  }
);

export default axiosInstance;
