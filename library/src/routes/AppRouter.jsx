// src/routes/AppRouter.jsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import UserHome from '../pages/user/UserHome';
import AdminHome from '../pages/admin/UserManagePage';
import BookDetail from '../pages/book/BookDetail';
import BookManagePage from '../pages/admin/BookManagePage';
import BorrowHistoryPage from '../pages/admin/BorrowHistoryPage';
import UserDetail from '../pages/user/UserDetail';
import Layout from '../components/Layout';
import LoanPage from '../pages/admin/LoanPage';
import { useAuth } from '../context/AuthContext';

export default function AppRouter() {
  const { auth, checkAuth } = useAuth();


  if (auth.isLoading) return <div className="text-center mt-20">인증 확인 중...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage checkAuth={checkAuth} />} />
        <Route path="/book/:id" element={<BookDetail />} />

        {/* USER 권한 */}
        <Route
          path="/user"
          element={
            !auth.isLoading && auth.isAuthenticated && auth.role === 'USER' ? (
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
        <Route
          path="/admin/loans"
          element={
            auth.isAuthenticated && auth.role === 'ADMIN' ? (
              <Layout><LoanPage /></Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/user/:userId"
          element={
            auth.isAuthenticated && auth.role === 'ADMIN' ? (
              <Layout><UserDetail /></Layout>
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
