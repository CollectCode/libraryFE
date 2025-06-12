// src/pages/admin/UserDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserById } from '../../api/User'; // 사용자 대출 내역을 가져오는 API 함수 추가 필요
import { fetchLoansByUserId } from '../../api/Loans';

export default function UserDetail() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [loanHistory, setLoanHistory] = useState([]); // 대출 내역 상태 추가
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    totalElements: 0,
    size: 10,
    first: true,
    last: true
  });
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetail();
    fetchUserLoanHistory();
  }, [userId]);

  useEffect(() => {
    fetchUserLoanHistory();
  }, [currentPage]);

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      const data = await fetchUserById(userId);
      setUser(data.user || data);
      console.log("User detail data:", data);
    } catch (error) {
      console.error("Failed to fetch user detail:", error);
    }
    setLoading(false);
  };

  const fetchUserLoanHistory = async () => {
  try {
    const data = await fetchLoansByUserId(userId);
    console.log(data);
    
    // 오늘 날짜 (YYYY-MM-DD 형식으로 변환)
    const today = new Date().toISOString().split('T')[0];
    
    // 대출 기록에서 연체 상태 업데이트
    const updatedLoanHistory = (data || []).map(loan => {
      // returnExpireDate가 오늘보다 이전이고, 아직 반납하지 않았다면 LATE로 변경
      if (loan.returnExpireDate < today && loan.status !== 'RETURNED') {
        return { ...loan, status: 'LATE' };
      }
      return loan;
    });
    
      setLoanHistory(updatedLoanHistory);
      setPageInfo({
        totalPages: data.page?.totalPages || 0,
        totalElements: data.page?.totalElements || 0,
        size: 10,
        first: data.page?.first || true,
        last: data.page?.last || true
      });
      console.log("User loan history data:", updatedLoanHistory);
    } catch (error) {
      console.error("Failed to fetch user loan history:", error);
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

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const handleEdit = () => {
    navigate(`/admin/user/edit/${userId}`); // 유저 편집 페이지로 이동 (필요시)
  };

  // 대출 상태에 따른 텍스트 및 색상 반환
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'LOANING':
        return { text: '대출 중', color: 'bg-red-100 text-red-800' };
      case 'RETURNED':
        return { text: '반납 완료', color: 'bg-green-100 text-green-800' };
      case 'LATE':
        return { text: '연체', color: 'bg-orange-100 text-orange-800' };
      case 'RETURN_LATE':
        return { text: '연체 반납', color: 'bg-red-100 text-red-800'}
      default:
        return { text: '알 수 없음', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (loading) {
    return (
      <div className="p-6 w-full mx-auto">
        <p>데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 w-full mx-auto">
        <p>사용자 정보를 찾을 수 없습니다.</p>
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">사용자 상세 정보</h1>
      </div>
       
      <div className="bg-white border rounded-lg shadow-sm w-full">
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6">

            {/* 사용자 정보 영역 */}
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {user.username?.trim()}
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === 'ADMIN' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex">
                  <span className="w-20 text-gray-600 font-medium">ID:</span>
                  <span className="text-gray-800 font-mono">{user.id}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-gray-600 font-medium">이름:</span>
                  <span className="text-gray-800">{user.username?.trim() || '-'}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-gray-600 font-medium">전화번호:</span>
                  <span className="text-gray-800">{user.phone?.trim() || '-'}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-gray-600 font-medium">부서:</span>
                  <span className="text-gray-800">{user.dept?.trim() || '-'}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-gray-600 font-medium">권한:</span>
                  <span className="text-gray-800">{user.role || '-'}</span>
                </div>
                <h3 className="text-lg font-semibold mb-3">메모</h3>
                <div className="text-gray-600">
                  <p className="bg-gray-50 p-4 rounded border">
                    {user.info?.trim() || '등록된 메모가 없습니다.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 대출/반납 내역 섹션 */}
      <div className="mt-6 bg-white border rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">대출/반납 내역</h3>
          
          {loanHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              대출 내역이 없습니다.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 border text-center">대출 ID</th>
                      <th className="p-3 border text-center">도서 제목</th>
                      <th className="p-3 border text-center">대출일</th>
                      <th className="p-3 border text-center">반납 기한</th>
                      <th className="p-3 border text-center">실제 반납일</th>
                      <th className="p-3 border text-center">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanHistory.map((loan) => {
                      const statusDisplay = getStatusDisplay(loan.status);
                      return (
                        <tr key={loan.loanId} className="hover:bg-gray-50">
                          <td className="border p-3 font-mono">{loan.loanId}</td>
                          <td className="border p-3 font-mono">{loan.bookTitle}</td>
                          <td className="border p-3">{formatDate(loan.loanDate)}</td>
                          <td className="border p-3">{formatDate(loan.returnExpireDate)}</td>
                          <td className="border p-3">{formatDate(loan.returnDate)}</td>
                          <td className="border p-3 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.color}`}>
                              {statusDisplay.text}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 페이징 */}
              {pageInfo.totalPages > 1 && (
                <div className="mt-4 flex justify-center items-center gap-2">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}