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
    // Do something with response data
    // For example, logging or inspecting the response headers
    console.log('Response Headers:', response.headers);

    // If you want to check if the 'Document-Policy' header exists
    if (response.headers['document-policy'] === 'js-profiling') {
      console.log('Document-Policy header is correctly set.');
    }

    return response.data;
  },
  function (error) {
    // Do something with response error
    if (error.response && (error.response.status === 405 || error.response.status === 403 )) {
      store.dispatch(setToken(null));
    }
    return Promise.reject(error);
  }
);

export default customAxios;
