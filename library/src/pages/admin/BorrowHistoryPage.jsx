// src/pages/admin/BorrowHistoryPage.jsx
import { useEffect, useState } from 'react';
import { fetchBorrowHistory } from '../../api/Borrow';

export default function BorrowHistoryPage() {
  const [histories, setHistories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await fetchBorrowHistory({ keyword: searchKeyword });
    setHistories(data);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadHistory();
  };

  return (
    <div className="p-6 w-[1000px]">
      <h2 className="text-xl font-bold mb-4">대출/반납 이력 관리</h2>

      <form onSubmit={handleSearch} className="flex gap-4 mb-4">
        <input
          type="text"
          className="border px-3 py-2 rounded w-[870px]"
          placeholder="사용자 이름 또는 도서 제목 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          검색
        </button>
      </form>

      <table className="w-full table-auto text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">도서 제목</th>
            <th className="border p-2">사용자 이름</th>
            <th className="border p-2">대출일</th>
            <th className="border p-2">반납일</th>
            <th className="border p-2">상태</th>
          </tr>
        </thead>
        <tbody>
          {histories.map((h) => (
            <tr key={h.id} className="text-center">
              <td className="border p-2">{h.bookTitle}</td>
              <td className="border p-2">{h.userName}</td>
              <td className="border p-2">{h.borrowDate}</td>
              <td className="border p-2">{h.returnDate || '반납 안됨'}</td>
              <td className={`border p-2 font-semibold ${
                h.status === '연체' ? 'text-red-500' :
                h.status === '대출 중' ? 'text-yellow-500' :
                'text-green-600'
              }`}>
                {h.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
