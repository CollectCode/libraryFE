// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    name: null,
    role: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const resetAuth = async () => {
    if(auth != null)  {
      setAuth({
        name: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }

  // 백엔드 인증 상태 확인 함수
  const checkAuth = async () => {
    await resetAuth();
    console.log("Called checkAuth in AuthContext");
    try {
      const res = await axios.get('http://localhost:7070/api/user/auth/me', {
        withCredentials: true, // 쿠키 포함
      });
      const user = res.data.user;
      console.log("Auth Context in user : ", user);
      setAuth({
        name: user.username,
        role: user.role,
        isAuthenticated: true,
        isLoading: false,
      });
      return user;
    } catch (err) {
      setAuth({
        name: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
