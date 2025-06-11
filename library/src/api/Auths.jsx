// src/api/auth.js
import axiosInstance from './AxiosInstance';

export const login = async (data) => {
  // JWT는 쿠키에 저장되므로 별도 token 저장 없음
  const response = await axiosInstance.post('/login', data);
  return response.data; // 메시지나 사용자 정보만 사용
};

export const logout = async () => {
  // JWT는 쿠키에 저장되므로 별도 token 저장 없음
  const response = await axiosInstance.get('/user/logout');
  return response.data; // 메시지나 사용자 정보만 사용
};

// 현재 로그인 사용자 조회
export const fetchMe = async () => {
  try {
    const response = await axiosInstance.get('/user/auth/me', {
      withCredentials: true
    });
    return response.data;
  } catch(err) {
    console.error("인증 실패 : ", err);
  }
};
