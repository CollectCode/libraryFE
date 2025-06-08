// src/pages/admin/UserManagePage.jsx
import { useEffect, useState } from 'react';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../api/User';

export default function UserManagePage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', memo: '' });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    totalElements: 0,
    size: 10,
    first: true,
    last: true
  });

  useEffect(() => {
    loadUsers();
    console.log("Called useEffect");
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(pageInfo.totalPages - 1, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getAllUsers(currentPage);
    console.log(data);
    const transformedData = data.content.map(item => item.user);
    setUsers(transformedData);
    setCurrentPage(data.page.number);
    const setPage = {
      totalPages: data.page.totalPages,
      totalElements: data.page.totalElements,
      size: 10,
      first: true,
      last: true
    };
    setPageInfo(setPage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateUser(editingId, form);
    } else {
      await createUser(form);
    }
    setForm({ name: '', phone: '', memo: '' });
    setEditingId(null);
    loadUsers();
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, phone: user.phone, memo: user.memo });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteUser(id);
      loadUsers();
    }
  };

  return (
    <div className="p-6">
      <h2 className="w-[950px] text-xl font-bold mb-4">사용자 관리</h2>

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="이름"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border px-2 py-1 rounded"
          required
        />
        <input
          type="text"
          placeholder="전화번호"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border px-2 py-1 rounded"
          required
        />
        <input
          type="text"
          placeholder="메모"
          value={form.memo}
          onChange={(e) => setForm({ ...form, memo: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-3 py-1"
        >
          {editingId ? '수정' : '등록'}
        </button>
      </form>

      <table className="w-full table-auto border text-sm mb-14">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">이름</th>
            <th className="p-2 border">전화번호</th>
            <th className="p-2 border">메모</th>
            <th className="p-2 border">작업</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">{user.phone}</td>
              <td className="border p-2">{user.info}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 페이징 정보 및 네비게이션 */}
          <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            {pageInfo.totalPages > 1 && (
              <div className="flex items-center gap-2">
                {/* 첫 페이지 버튼 */}
                <button
                  onClick={() => handlePageChange(0)}
                  disabled={pageInfo.first}
                  className={`px-3 py-1 rounded ${
                    pageInfo.first 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  처음
                </button>
                
                {/* 이전 페이지 버튼 */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={pageInfo.first}
                  className={`px-3 py-1 rounded ${
                    pageInfo.first 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  이전
                </button>
                
                {/* 페이지 번호들 */}
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                ))}
                
                {/* 다음 페이지 버튼 */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={pageInfo.last}
                  className={`px-3 py-1 rounded ${
                    pageInfo.last 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  다음
                </button>
                
                {/* 마지막 페이지 버튼 */}
                <button
                  onClick={() => handlePageChange(pageInfo.totalPages - 1)}
                  disabled={pageInfo.last}
                  className={`px-3 py-1 rounded ${
                    pageInfo.last 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  마지막
                </button>
              </div>
            )}
          </div>
    </div>
  );
}
