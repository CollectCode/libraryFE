// src/pages/auth/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/Auths';
import { Book } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage({ checkAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 로그인 요청 (서버에서 쿠키로 토큰 저장)
      await login({ username, password });
      console.log('로그인 성공');

      // 로그인 후 인증 상태 업데이트
      await checkAuth();
      console.log(auth);

      // 인증 상태와 역할 기반 라우팅
      if (auth.role === 'ADMIN') {
        console.log("Auth in admin", auth);
        navigate('/admin');
      } else {
        console.log("Auth in User", auth);
        navigate('/user');
      }
    } catch (err) {
      console.error(err);
      setError('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center bg-white py-10">
      <div className="text-center mb-8">
        <Book className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">미니 도서관</h1>
        <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
          <input
            type="text"
            className="w-full px-3 py-2 border rounded mb-4"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="w-full px-3 py-2 border rounded mb-4"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select
            className="w-full px-3 py-2 border rounded mb-4"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">사용자</option>
            <option value="ADMIN">관리자</option>
          </select>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button className="w-full bg-blue-500 text-white py-2 rounded">로그인</button>
        </form>
      </div>
    </div>
  );
}
