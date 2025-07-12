import axios from 'axios';
import { getFirebaseToken } from '../utils/getFirebaseToken'; // adjust path if needed

const axiosInstance = axios.create({
  baseURL: '/api',
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getFirebaseToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
