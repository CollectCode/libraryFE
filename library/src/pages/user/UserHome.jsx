// src/pages/user/UserHome.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchBooks, borrowBook, returnBook } from '../../api/Books';
import { fetchMe } from '../../api/Auths'; // 인증 정보 요청 API

export default function UserHome() {
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const fetchBooks = async () => {
    const params = {
      keyword: keyword,
      sort: sortBy,
    };
    const data = await searchBooks(params);
    setBooks(data);
  };

  const handleBorrow = async (bookId) => {
    await borrowBook(bookId, userId);
    fetchBooks();
  };

  const handleReturn = async (bookId) => {
    await returnBook(bookId, userId);
    fetchBooks();
  };

  return (
    // max-w-7xl: 최대 너비 약 1280px, mx-auto: 좌우 중앙 정렬, px-6: 좌우 padding(여백)
    <div className="p-6 max-w-[1280px] mx-auto">
      <h1 className="text-2xl font-bold mb-4">도서 검색</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          className="border px-3 py-2 rounded"
          placeholder="제목, 저자, 출판사 입력"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded min-w-[150px]"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">정렬 선택</option>
          <option value="title">제목</option>
          <option value="author">저자</option>
          <option value="publisher">출판사</option>
          <option value="year">출간년도</option>
        </select>
        <button
          onClick={fetchBooks}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          검색
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">제목</th>
              <th className="p-2 border">저자</th>
              <th className="p-2 border">출판사</th>
              <th className="p-2 border">출간년도</th>
              <th className="p-2 border">상태</th>
              <th className="p-2 border">작업</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="text-center">
                <td className="p-2 border">{book.title}</td>
                <td className="p-2 border">{book.author}</td>
                <td className="p-2 border">{book.publisher}</td>
                <td className="p-2 border">{book.year}</td>
                <td className="p-2 border">
                  {book.available ? '대출 가능' : '대출 중'}
                </td>
                <td className="p-2 border">
                  {book.available ? (
                    <button
                      onClick={() => handleBorrow(book.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      대출
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReturn(book.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      반납
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
