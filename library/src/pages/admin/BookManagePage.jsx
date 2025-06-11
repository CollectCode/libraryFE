// src/pages/admin/BookManagePage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchBooks, deleteBook, getAllBooks, createBook, updateBook, getBookById } from '../../api/Books';

export default function BookManagePage() {
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [searchBy, setSearchBy] = useState('');
  const [books, setBooks] = useState([]);
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

  // 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [originalBookImg, setOriginalBookImg] = useState(''); // 원본 이미지 URL 저장
  const [form, setForm] = useState({
    title: '',
    author: '',
    publish: '',
    bookImg: '',
    publishDate: '',
    price: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let data;
      data = await getAllBooks(currentPage);
      
      console.log(data);
      let transformedData = data.content.map(item => item);
      
      // 정렬 적용
      if (sortField) {
        transformedData = sortBooks(transformedData, sortField, sortDirection);
      }
      console.log("BookData : ",data);
      setBooks(transformedData);
      setCurrentPage(data.page.number);
      const setPage = {
        totalPages: data.page.totalPages,
        totalElements: data.page.totalElements,
        size: 10,
        first: data.page.first,
        last: data.page.last
      };
      setPageInfo(setPage);
    } catch (error) {
      console.error('도서 목록 조회 실패:', error);
    }
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
      if (field === 'id' || field === 'price') {
        aValue = Number(aValue);
        bValue = Number(bValue);
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

  const handleSearch = () => {
    setCurrentPage(0); // 검색 시 첫 페이지로 이동
    fetchBooks();
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteBook(id);
        fetchBooks(); // 목록 새로고침
      } catch (error) {
        console.error('도서 삭제 실패:', error);
        alert('도서 삭제에 실패했습니다.');
      }
    }
  };

  // 모달 관련 함수들
  const openAddModal = () => {
    setEditingBook(null);
    setOriginalBookImg(''); // 원본 이미지 초기화
    setForm({
      title: '',
      author: '',
      publish: '',
      bookImg: '',
      publishDate: '',
      price: ''
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = async (book) => {
    setModalLoading(true);
    try {
      // 상세 정보를 가져와서 폼에 설정
      const bookData = await getBookById(book.id);
      setEditingBook(book);
      setOriginalBookImg(bookData.bookImg || ''); // 원본 이미지 URL 저장
      setForm({
        title: bookData.title || '',
        author: bookData.author || '',
        publish: bookData.publish || '',
        bookImg: bookData.bookImg || '',
        publishDate: bookData.publishDate || '',
        price: bookData.price ? bookData.price.toString() : ''
      });
      setErrors({});
      setIsModalOpen(true);
    } catch (error) {
      console.error('도서 정보 조회 실패:', error);
      alert('도서 정보를 불러오는데 실패했습니다.');
    }
    setModalLoading(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
    setOriginalBookImg(''); // 원본 이미지 초기화
    setForm({
      title: '',
      author: '',
      publish: '',
      bookImg: '',
      publishDate: '',
      price: ''
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }
    
    if (!form.author.trim()) {
      newErrors.author = '저자를 입력해주세요.';
    }
    
    if (!form.publish.trim()) {
      newErrors.publish = '출판사를 입력해주세요.';
    }
    
    if (!form.publishDate) {
      newErrors.publishDate = '출간일을 입력해주세요.';
    }
    
    if (!form.price.trim()) {
      newErrors.price = '가격을 입력해주세요.';
    } else if (isNaN(form.price) || Number(form.price) < 0) {
      newErrors.price = '올바른 가격을 입력해주세요.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setModalLoading(true);
    
    try {
      const bookData = {
        title: form.title.trim(),
        author: form.author.trim(),
        publish: form.publish.trim(),
        bookImg: form.bookImg.trim(),
        publishDate: form.publishDate,
        price: parseInt(form.price, 10)
      };

      if (editingBook) {
        await updateBook(editingBook.id, bookData);
        alert('도서가 성공적으로 수정되었습니다.');
      } else {
        await createBook(bookData);
        alert('도서가 성공적으로 등록되었습니다.');
      }
      
      closeModal();
      fetchBooks(); // 목록 새로고침
    } catch (error) {
      console.error('도서 저장 실패:', error);
      alert(`도서 ${editingBook ? '수정' : '등록'}에 실패했습니다.`);
    }
    
    setModalLoading(false);
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 해당 필드의 에러 제거
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

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

  const handleImageFile = (file) => {
    const formData = new FormData();

    console.log(file);

    formData.append('file', file);

    fetch('http://localhost:7070/api/files/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => response.text())
      .then(url => {
        console.log("save Image Url : ", url);
        setForm(prev => ({
          ...prev,
          bookImg: url
        }));
      })
      .catch(error => {
        console.error('파일 업로드 실패:', error);
      });
  };

  // 이미지 제거 함수
  const handleRemoveImage = () => {
    setForm(prev => ({
      ...prev,
      bookImg: ''
    }));
  };

  // 이미지 표시를 위한 함수
  const getDisplayImage = () => {
    return form.bookImg || '';
  };

  const searchOptions = [
    { value: '', label: '검색 선택' },
    { value: 'title', label: '제목' },
    { value: 'author', label: '저자' },
    { value: 'publish', label: '출판사' },
  ];

  return (
    <div>
      {loading ? (
        <p>데이터를 불러오는 중입니다...</p>
      ) : (
        <div className="p-6 w-full mx-auto">
          <h1 className="w-full text-2xl font-bold mb-4">도서 관리</h1>

          <div className="flex flex-wrap gap-4 mb-4">
            <select
              className="border px-3 py-2 rounded min-w-[150px]"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              {searchOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="flex-1 border px-3 py-2 rounded"
              placeholder="제목, 저자, 출판사 입력"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              검색
            </button>
            <button
              onClick={openAddModal}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              등록
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
                      ID
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
                      onClick={() => handleSort('price')}
                      className="flex items-center justify-center w-full hover:bg-gray-200 p-1 rounded"
                    >
                      가격
                      {renderSortIcon('price')}
                    </button>
                  </th>
                  <th className="p-2 border">작업</th>
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
                    <td className="p-2 border">{book.price?.toLocaleString()}원</td>
                    <td className="p-2 border space-x-2">
                      <button
                        onClick={() => openEditModal(book)}
                        className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        삭제
                      </button>
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

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 text-left">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingBook ? '도서 수정' : '도서 등록'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 제목 */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="도서 제목을 입력하세요"
                    value={form.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* 저자 */}
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                    저자 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="author"
                    className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.author ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="저자명을 입력하세요"
                    value={form.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                  />
                  {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
                </div>

                {/* 출판사 */}
                <div>
                  <label htmlFor="publish" className="block text-sm font-medium text-gray-700 mb-1">
                    출판사 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="publish"
                    className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.publish ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="출판사명을 입력하세요"
                    value={form.publish}
                    onChange={(e) => handleInputChange('publish', e.target.value)}
                  />
                  {errors.publish && <p className="text-red-500 text-sm mt-1">{errors.publish}</p>}
                </div>

                {/* 도서 이미지 업로드 */}
                <div>
                  <label htmlFor="bookImgUpload" className="block text-sm font-medium text-gray-700 mb-1">
                    도서 이미지 업로드 
                  </label>
                  
                  <div className="space-y-2">
                    {getDisplayImage() ? (
                      <div className="relative inline-block">
                        <img
                          src={getDisplayImage()}
                          alt="도서 이미지 미리보기"
                          className="w-32 h-40 object-cover border rounded"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                        <div className="mt-2 text-sm text-gray-600">
                          {editingBook && form.bookImg === originalBookImg 
                            ? '기존 이미지' 
                            : '새로 업로드된 이미지'
                          }
                        </div>
                      </div>
                    ) : (
                      <div
                        className="w-full border-dashed border-2 border-gray-300 p-4 text-center rounded cursor-pointer hover:border-blue-500"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files[0];
                          if (file) {
                            handleImageFile(file);
                          }
                        }}
                        onClick={() => document.getElementById('bookImgUpload').click()}
                      >
                        <p className="text-gray-500">이미지를 드래그 앤 드롭하거나 클릭하여 업로드</p>
                      </div>
                    )}

                    {getDisplayImage() && (
                      <div
                        className="w-full border-dashed border-2 border-gray-300 p-2 text-center rounded cursor-pointer hover:border-blue-500"
                        onClick={() => document.getElementById('bookImgUpload').click()}
                      >
                        <p className="text-gray-500 text-sm">다른 이미지로 변경하려면 클릭</p>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    id="bookImgUpload"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleImageFile(file);
                      }
                    }}
                  />
                </div>

                {/* 출간일 */}
                <div>
                  <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
                    출간일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="publishDate"
                    className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.publishDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={form.publishDate}
                    onChange={(e) => handleInputChange('publishDate', e.target.value)}
                  />
                  {errors.publishDate && <p className="text-red-500 text-sm mt-1">{errors.publishDate}</p>}
                </div>

                {/* 가격 */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    가격 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="price"
                      min="0"
                      className={`w-full border px-3 py-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="가격을 입력하세요"
                      value={form.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                    />
                    <span className="absolute right-3 top-2 text-gray-500">원</span>
                  </div>
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                {/* 버튼 그룹 */}
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className={`px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      modalLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {modalLoading ? '처리중...' : (editingBook ? '수정' : '등록')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}