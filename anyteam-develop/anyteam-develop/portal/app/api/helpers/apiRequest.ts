import axios from 'axios';
import storage from '~/storage';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = process.env.API_URL || 'http://localhost:3000';

interface AxiosOptionsInterface {
  method: any;
  url: string;
  data: {};
  params: {};
}

export const apiRequest = (url : string, methodType : string, data: object | FormData = {} , multipart = false, params: object = {}) => {
  const token = storage.getAccessToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = token;
  }

  if (multipart) {
    axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
  }

  let axiosOptions : AxiosOptionsInterface = {
    method: methodType,
    url: url,
    data: data,
    params: params,
  }
  return new Promise<any>(
    (resolve, reject) => {
      axios(axiosOptions)
        .then(response => {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error.response);
        });
    });
};
