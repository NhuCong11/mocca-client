import axios from 'axios';

import { ERROR_MESSAGES } from '@/constants';
import { addOrUpdateFieldInLocalStorage, getLocalStorageItem } from '@/utils/localStorage';
import { removeCookie, setCookie } from 'typescript-cookie';
import { hostname } from './constants';

const axiosInstance = axios.create({
  baseURL: `${hostname}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động gắn token vào header
axiosInstance.interceptors.request.use(async (config) => {
  const token = JSON.parse(String(getLocalStorageItem('accessToken')));
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  function (response) {
    return { ...response.data, url: response.config.url };
  },

  async function (error) {
    const originalRequest = error.config;

    // Kiểm tra nếu mã trạng thái là 401 và không phải là lỗi từ phía request refresh token
    if (
      error.response.data.code === 401 &&
      [
        ERROR_MESSAGES.JWT_EXPIRED_VI,
        ERROR_MESSAGES.JWT_EXPIRED_EN,
        ERROR_MESSAGES.JWT_EXPIRED_ZH,
        ERROR_MESSAGES.JWT_EXPIRED_KO,
      ].includes(error.response.data.message) &&
      !originalRequest._retry &&
      !error.config.url.includes('refresh-tokens')
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = JSON.parse(String(getLocalStorageItem('refreshToken')));
        const response1 = await axiosInstance.post('v1/auth/refresh-tokens', { refreshToken: refreshToken });

        const newAccessToken = response1.data.accessToken;
        // Lưu trữ access token mới vào local storage hoặc nơi khác
        addOrUpdateFieldInLocalStorage(null, 'accessToken', newAccessToken);
        setCookie('accessToken', newAccessToken);
        // Cập nhật access token mới vào header của request ban đầu
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        // Thử gọi lại request ban đầu với access token mới
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Xử lý lỗi khi không thể refresh token
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        removeCookie('accessToken', { path: '/' });
        window.location.href = '/auth/signin';
        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      const { code, message } = error.response.data;
      return Promise.reject({ success: false, message: message, code: code, url: error.config.url });
    } else {
      // Nếu không có phản hồi từ máy chủ
      return Promise.reject({ success: false, message: 'Network error', code: 0 });
    }
  },
);

export default axiosInstance;
