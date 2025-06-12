// src/api/users.js
import axiosInstance from './AxiosInstance';

// 사용자 전체 조회
export const getAllUsers = async (pages) => {
  const response = await axiosInstance.get(`/user/${pages}`);
  return response.data;
};

// 사용자 등록
export const createUser = async (userData) => {
  const response = await axiosInstance.post('/user/add', userData);
  return response.data;
};

// 사용자 수정
export const updateUser = async (id, user) => {
  console.log("User Update Request Data : ", user);
  const response = await axiosInstance.put(`/user/update/${id}`, user);
  return response.data;
};

// 사용자 삭제 (선택사항)
export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/user/remove/${id}`);
  return response.data;
};

// 사용자 ID로 검색
export const fetchUserById = async (userId) => {
  const response = await axiosInstance.get(`/user/get/${userId}`);
  console.log("get User By Id : ", response.data);
  return response.data
};