// src/pages/user/UserHome.jsx
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { searchBooks, borrowBook, returnBook, getAllBooks } from '../../api/Books';
import { fetchMe } from '../../api/Auths'; // 인증 정보 요청 API

export default function UserHome() {
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [searchBy, setSearchBy] = useState('');
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState(''); // 정렬 필드
  const [sortDirection, setSortDirection] = useState('asc'); // 정렬 방향
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
    let transformedData = data.content.map(item => item);
    
    // 정렬 적용
    if (sortField) {
      transformedData = sortBooks(transformedData, sortField, sortDirection);
    }
    
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

  // 정렬 함수
  const sortBooks = (booksArray, field, direction) => {
    return [...booksArray].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      
      // 문자열 값들은 trim 처리
      if (typeof aValue === 'string') aValue = aValue?.trim() || '';
      if (typeof bValue === 'string') bValue = bValue?.trim() || '';
      
      // 날짜 필드의 경우 Date 객체로 변환
      if (field === 'publishDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      // 숫자 필드의 경우 숫자로 변환
      if (field === 'id') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      
      // available 필드의 경우 boolean 값으로 처리
      if (field === 'available') {
        aValue = a.available ?? true;
        bValue = b.available ?? true;
      }
      
      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }
      
      return direction === 'desc' ? comparison * -1 : comparison;
    });
  };

  // 정렬 핸들러
  const handleSort = (field) => {
    let newDirection = 'asc';
    
    // 같은 필드를 클릭했을 때 방향 토글
    if (sortField === field && sortDirection === 'asc') {
      newDirection = 'desc';
    }
    
    setSortField(field);
    setSortDirection(newDirection);
    
    // 현재 책 목록을 정렬
    const sortedBooks = sortBooks(books, field, newDirection);
    setBooks(sortedBooks);
  };

  // 정렬 아이콘 렌더링
  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <span className="text-gray-400 ml-1">↕</span>;
    }
    return sortDirection === 'asc' ? 
      <span className="text-blue-600 ml-1">↑</span> : 
      <span className="text-blue-600 ml-1">↓</span>;
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

  const searchOptions = [
    { value: '', label: '검색 선택' },
    { value: 'title', label: '제목' },
    { value: 'author', label: '저자' },
    { value: 'publisher', label: '출판사' },
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
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              {searchOptions.map((option) => (
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

          <div className="overflow-x-auto mb-14">
            <table className="w-full text-sm table-auto border">
              <thead className="bg-gray-100">
                <tr>
                  <th className='p-2 border'>
                    <button 
                      onClick={() => handleSort('id')}
                      className="flex items-center justify-center w-full hover:bg-gray-200 p-1 rounded"
                    >
                      No
                      {renderSortIcon('id')}
                    </button>
                  </th>
                  <th className="p-2 border">
                    <button 
                      onClick={() => handleSort('title')}
                      className="flex items-center justify-center w-full hover:bg-gray-200 p-1 rounded"
                    >
                      제목
                      {renderSortIcon('title')}
                    </button>
                  </th>
                  <th className="p-2 border">
                    <button 
                      onClick={() => handleSort('author')}
                      className="flex items-center justify-center w-full hover:bg-gray-200 p-1 rounded"
                    >
                      저자
                      {renderSortIcon('author')}
                    </button>
                  </th>
                  <th className="p-2 border">
                    <button 
                      onClick={() => handleSort('publish')}
                      className="flex items-center justify-center w-full hover:bg-gray-200 p-1 rounded"
                    >
                      출판사
                      {renderSortIcon('publish')}
                    </button>
                  </th>
                  <th className="p-2 border">
                    <button 
                      onClick={() => handleSort('publishDate')}
                      className="flex items-center justify-center w-full hover:bg-gray-200 p-1 rounded"
                    >
                      출간일
                      {renderSortIcon('publishDate')}
                    </button>
                  </th>
                  <th className="p-2 border">
                    <button 
                      onClick={() => handleSort('available')}
                      className="flex items-center justify-center w-full hover:bg-gray-200 p-1 rounded"
                    >
                      상태
                      {renderSortIcon('available')}
                    </button>
                  </th>
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
                      {(book.available ?? true) ? <td className="p-2 border text-green-600">대출 가능</td> : <td className="p-2 border text-red-600">대출 중</td>}
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