import { Codes } from '@/utils/enum';
import axios from 'axios';

const showError = () => { // todo
};

const service = axios.create({
  baseURL: process.env.VUE_APP_PRO_URL,
  timeout: 2 * 60 * 1000,
});

service.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

service.interceptors.response.use(
  (response) => {
    const { code } = response.data;
    if (code && code !== Codes.Success) { // ethapi has no code
      showError();
      return Promise.reject(response);
    }
    return response;
  },
  (error) => {
    showError();
    return Promise.reject(error);
  },
);

export default service;
