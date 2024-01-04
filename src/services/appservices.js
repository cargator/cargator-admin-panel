import axios from "axios";

import store from "../redux/store";
import { setToken } from "redux/reducers/authReducer";

const customAxios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

customAxios.interceptors.request.use(
  function (request) {
    // Do something before request is sent
    request.headers.Authorization = `Bearer ${store.getState().auth.token}`;
    return request;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

customAxios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log('Interceptor Data :>> ', response.data)
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // console.log('Interceptor Error :>> ', error)
    if (error.response.status === 403 || error.response.status === 401) {
      store.dispatch(setToken(null));
    }
    return Promise.reject(error);
  }
);

export default customAxios;
