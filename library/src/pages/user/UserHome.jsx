// src/pages/user/UserHome.jsx
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { searchBooks, borrowBook, returnBook, getAllBooks } from '../../api/Books';
import { fetchMe } from '../../api/Auths'; // 인증 정보 요청 API

export default function UserHome() {
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    totalElements: 0,
    size: 10,
    first: true,
    last: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    console.log("Called useEffect");
  }, [currentPage]);

  const fetchBooks = async () => {
    setLoading(true);
    const data = await getAllBooks(currentPage);
    // 데이터 구조 변환: [{book: {...}}] -> [{...}]
    console.log("Books Data : ", data);
    console.log(data.page);
    const transformedData = data.content.map(item => item.book);
    setBooks(transformedData);
    setCurrentPage(data.page.number);
    const setPage = {
      totalPages: data.page.totalPages,
      totalElements: data.page.totalElements,
      size: 10,
      first: true,
      last: true
    };
    setPageInfo(setPage);
    setLoading(false);
  };

  const handleBorrow = async (bookId) => {
    await borrowBook(bookId, userId);
    fetchBooks();
  };

  const handleReturn = async (bookId) => {
    await returnBook(bookId, userId);
    fetchBooks();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(0); // 검색 시 첫 페이지로 이동
    fetchBooks();
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

  const sortOptions = [
    { value: '', label: '정렬 선택' },
    { value: 'title', label: '제목' },
    { value: 'author', label: '저자' },
    { value: 'publisher', label: '출판사' },
    { value: 'year', label: '출간년도' }
  ];

  return (
    <div>
      {loading ? (
        <p>데이터를 불러오는 중입니다...</p>
      ) : (
        <div className="p-6 w-full mx-auto">
          <h1 className="w-full text-2xl font-bold mb-4">도서 검색</h1>

          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              placeholder="제목, 저자, 출판사 입력"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <select
              className="w-full border px-3 py-2 rounded min-w-[150px]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={fetchBooks}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded"
            >
              검색
            </button>
          </div>
          {/* 페이지네이션 정보 있던곳 */}
          <div className="overflow-x-auto mb-14">
            <table className="w-full text-sm table-auto border">
              <thead className="bg-gray-100">
                <tr>
                  <th className='p-2 border'>No</th>
                  <th className="p-2 border">제목</th>
                  <th className="p-2 border">저자</th>
                  <th className="p-2 border">출판사</th>
                  <th className="p-2 border">출간일</th>
                  <th className="p-2 border">상태</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                  <tr key={`book-${book.id}-${index}`} className="text-center">
                    <td className='p-2 border'>{book.id}</td>
                    <td className="p-2 border">
                      <Link 
                        to={`/book/${book.id}`} 
                        className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        {book.title?.trim()}
                      </Link>
                    </td>
                    <td className="p-2 border">{book.author?.trim()}</td>
                    <td className="p-2 border">{book.publish?.trim()}</td>
                    <td className="p-2 border">{book.publishDate}</td>
                    <td className="p-2 border">
                      {(book.available ?? true) ? '대출 가능' : '대출 중'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
      )}
    </div>
  );
}