// src/components/Header.jsx
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/Auths';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const response = logout();
    console.log("Logout : ", response);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">📚 미니 도서관</h1>
      <button onClick={handleLogout} className="bg-red-500 text-white font-medium">
        로그아웃
      </button>
    </header>
  );
}
