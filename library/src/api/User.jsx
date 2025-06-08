// src/api/users.js
import axiosInstance from './AxiosInstance';

// 사용자 전체 조회
export const getAllUsers = async (pages) => {
  const response = await axiosInstance.get(`/user/${pages}`);
  return response.data;
};

// 사용자 등록
export const createUser = async (userData) => {
  const response = await axiosInstance.post('/admin/user', userData);
  return response.data;
};

// 사용자 수정
export const updateUser = async (id, userData) => {
  const response = await axiosInstance.put(`/admin/user/${id}`, userData);
  return response.data;
};

// 사용자 삭제 (선택사항)
export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/admin/user/${id}`);
  return response.data;
};
