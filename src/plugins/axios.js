// src/plugins/axios.js
import Axios from 'axios';

const axiosInstance = Axios.create({
  // Set your default config values here
  baseURL: 'http://your-api-base-url.com',
  timeout: 10000, // for example, 'timeout' specifies the number of milliseconds before the request times out.
  // etc.
});

// Add interceptors here if needed
axiosInstance.interceptors.request.use(
  config => {
    // Perform actions before request is sent
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axiosInstance;
