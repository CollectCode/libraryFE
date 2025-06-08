// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:7070/api',
  withCredentials: true, // ✅ 쿠키 자동 포함
});

export default axiosInstance;
