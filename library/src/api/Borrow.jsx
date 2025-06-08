// src/api/borrow.js
import axiosInstance from './AxiosInstance';

// 전체 이력 조회 (필터 optional)
export const fetchBorrowHistory = async (params) => {
  const response = await axiosInstance.get('/admin/borrows', { params });
  return response.data;
};
