// src/components/Sidebar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { auth, checkAuth } = useAuth();

  return (
    <aside className="w-[200px] bg-gray-800 text-white h-[910px]">
      <nav className="flex flex-col p-4 space-y-2">
        {auth.role === 'USER' && (
          <Link to="/user" className="hover:bg-gray-700 p-2 rounded">
            📖 책 검색
          </Link>
        )}
        {auth.role === 'ADMIN' && (
          <>
            <Link to="/admin" className="hover:bg-gray-700 p-2 rounded">
              👤 사용자 관리
            </Link>
            <Link to="/admin/books" className="hover:bg-gray-700 p-2 rounded">
              📚 도서 관리
            </Link>
            <Link to="/admin/borrows" className="hover:bg-gray-700 p-2 rounded">
              📄 대출 이력
            </Link>
            <Link to="/admin/loans" className='hover:bg-gray-700 p-2 rounded'>
              🔁 대출/반납
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
