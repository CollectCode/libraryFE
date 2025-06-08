// src/pages/admin/UserManagePage.jsx
import { useEffect, useState } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../api/User';

export default function UserManagePage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', memo: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await fetchUsers();
    setUsers(data);
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

      <table className="w-full table-auto border text-sm">
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
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.phone}</td>
              <td className="border p-2">{user.memo}</td>
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
    </div>
  );
}
