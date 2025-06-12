// src/pages/user/BookDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, borrowBook, returnBook } from '../../api/Books'
import { fetchLoansByBookId } from '../../api/Loans';

const BASE_IMAGE_URL = 'http://localhost:7070';

export default function BookDetail() {
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(null);
  const [userId, setUserId] = useState('');
  const [loanHistory, setLoanHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookDetail();
    fetchBookLoanHistory();
    console.log("Called useEffect for BookDetail");
  }, [id]);

  const fetchBookDetail = async () => {
    setLoading(true);
    try {
      const data = await getBookById(id);
      // 데이터 구조에 따라 조정 (book 속성으로 감싸져 있는 경우)
      setBook(data.book || data);
      console.log("Book detail data:", data);
    } catch (error) {
      console.error("Failed to fetch book detail:", error);
    }
    setLoading(false);
  };

  const fetchBookLoanHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await fetchLoansByBookId(id);

      console.log("get Loan By BookId : ", data);
      
      setLoanHistory(data);
      console.log("Book loan history data:", data);
    } catch (error) {
      console.error("Failed to fetch book loan history:", error);
    }
    setHistoryLoading(false);
  };

  // 대출 가능 여부 판단 함수
  const isBookAvailable = () => {
    if (loanHistory.length === 0) return true; // 대출 이력이 없으면 대출 가능
    
    // 대출일 기준으로 내림차순 정렬하여 가장 최근 이력 가져오기
    const sortedHistory = [...loanHistory].sort((a, b) => new Date(b.loanDate) - new Date(a.loanDate));
    const latestLoan = sortedHistory[0];
    
    // 마지막 이력이 RETURNED 또는 RETURN_LATE면 대출 가능
    return latestLoan.status === 'RETURNED' || latestLoan.status === 'RETURN_LATE';
  };

  const handleBorrow = async () => {
    try {
      await borrowBook(book.id, userId);
      fetchBookDetail(); // 상태 업데이트를 위해 다시 fetch
      fetchBookLoanHistory(); // 대출 내역도 업데이트
      alert('도서가 성공적으로 대출되었습니다.');
    } catch (error) {
      console.error("Failed to borrow book:", error);
      alert('대출에 실패했습니다.');
    }
  };

  const handleReturn = async () => {
    try {
      await returnBook(book.id, userId);
      fetchBookDetail(); // 상태 업데이트를 위해 다시 fetch
      fetchBookLoanHistory(); // 대출 내역도 업데이트
      alert('도서가 성공적으로 반납되었습니다.');
    } catch (error) {
      console.error("Failed to return book:", error);
      alert('반납에 실패했습니다.');
    }
  };

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'RETURNED': { 
        text: '반납완료', 
        className: 'bg-green-100 text-green-800' 
      },
      'LOANING': { 
        text: '대출중', 
        className: 'bg-blue-100 text-blue-800' 
      },
      'LATE': { 
        text: '연체', 
        className: 'bg-red-100 text-red-800' 
      },
      'RETURN_LATE': {
        text: '연체반납',
        className: 'bg-yellow-100 text-yellow-800'
      }
    };
    
    const config = statusConfig[status] || { text: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6 w-full mx-auto">
        <p>데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="p-6 w-full mx-auto">
        <p>도서 정보를 찾을 수 없습니다.</p>
        <button
          onClick={handleGoBack}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">도서 상세 정보</h1>
        <button
          onClick={handleGoBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          목록으로
        </button>
      </div>

      <div className="bg-white border rounded-lg shadow-sm">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 책 이미지 영역 */}
            <div className="flex justify-center">
              {book.bookImg ? (
                <img
                  src={`${BASE_IMAGE_URL}${book.bookImg}`}
                  alt={book.title}
                  className="max-w-xs w-full h-auto border rounded-lg shadow-sm"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-64 h-80 bg-gray-200 border rounded-lg flex items-center justify-center text-gray-500"
                style={{ display: book.bookImg ? 'none' : 'flex' }}
              >
                이미지 없음
              </div>
            </div>

            {/* 책 정보 영역 */}
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {book.title?.trim()}
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex">
                  <span className="w-20 text-gray-600 font-medium">저자:</span>
                  <span className="text-gray-800">{book.author?.trim() || '-'}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-gray-600 font-medium">출판사:</span>
                  <span className="text-gray-800">{book.publish?.trim() || '-'}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-gray-600 font-medium">출간일:</span>
                  <span className="text-gray-800">{book.publishDate || '-'}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-gray-600 font-medium">가격:</span>
                  <span className="text-gray-800">
                    {book.price ? `${book.price.toLocaleString()}원` : '-'}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-20 text-gray-600 font-medium">도서 ID:</span>
                  <span className="text-gray-800">{book.id}</span>
                </div>
              </div>
              <div className="flex justify-center items-center space-x-4">
                <span className={`px-6 py-2 rounded-full text-large font-medium ${
                  isBookAvailable() 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isBookAvailable() ? '대출 가능' : '대출 중'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 추가 정보나 설명이 있다면 여기에 추가 */}
      <div className="mt-6 bg-white border rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-3">도서 정보</h3>
          <div className="text-gray-600">
            <p>이 도서에 대한 자세한 정보나 설명이 있다면 여기에 표시됩니다.</p>
            <p className="mt-2">현재 도서의 대출 상태를 확인하고 대출 또는 반납을 진행할 수 있습니다.</p>
          </div>
        </div>
      </div>

      {/* 대출/반납 내역 섹션 */}
      <div className="mt-6 bg-white border rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">대출/반납 내역</h3>
          
          {historyLoading ? (
            <p className="text-gray-500">내역을 불러오는 중...</p>
          ) : loanHistory.length === 0 ? (
            <p className="text-gray-500">대출 내역이 없습니다.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      대출자
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      대출일
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      반납 기한
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      반납일
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loanHistory.map((loan) => (
                    <tr key={loan.loanId} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {loan.username || `사용자 ${loan.userId}`}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {loan.loanDate}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {loan.returnExpireDate}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {loan.returnDate || '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(loan.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}