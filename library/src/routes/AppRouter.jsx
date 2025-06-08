// src/routes/AppRouter.jsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import UserHome from '../pages/user/UserHome';
import AdminHome from '../pages/admin/UserManagePage';
import BookManagePage from '../pages/admin/BookManagePage';
import BorrowHistoryPage from '../pages/admin/BorrowHistoryPage';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function AppRouter() {
  const { auth, checkAuth } = useAuth();

  // 최초 인증 상태만 확인
  useEffect(() => {
    console.log("Called AppRouter useEffect");
    console.log("auth : ", auth);
    console.log("check : ", auth.isAuthenticated && auth.role === 'USER');
    checkAuth();
  }, []);

  if (auth.isLoading) return <div className="text-center mt-20">인증 확인 중...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage checkAuth={checkAuth} />} />

        {/* USER 권한 */}
        <Route
          path="/user"
          element={
            auth.isAuthenticated && auth.role === 'USER' ? (
              <Layout><UserHome /></Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* ADMIN 권한 */}
        <Route
          path="/admin"
          element={
            auth.isAuthenticated && auth.role === 'ADMIN' ? (
              <Layout><AdminHome /></Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/books"
          element={
            auth.isAuthenticated && auth.role === 'ADMIN' ? (
              <Layout><BookManagePage /></Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/borrows"
          element={
            auth.isAuthenticated && auth.role === 'ADMIN' ? (
              <Layout><BorrowHistoryPage /></Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
        {/* 기본 리다이렉트 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}
