// src/pages/admin/BorrowHistoryPage.jsx
import { useEffect, useState } from 'react';
import { fetchLoanHistory } from '../../api/Loans';

export default function BorrowHistoryPage() {
  const [histories, setHistories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortField, setSortField] = useState(''); // 정렬 필드
  const [sortDirection, setSortDirection] = useState('asc'); // 정렬 방향

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await fetchLoanHistory({ keyword: searchKeyword });
    console.log("Loan datas : ", data);
    
    // 정렬 적용
    if (sortField) {
      const sortedData = sortHistories(data, sortField, sortDirection);
      setHistories(sortedData);
    } else {
      setHistories(data);
    }
  };

  // 정렬 함수
  const sortHistories = (historiesArray, field, direction) => {
    return [...historiesArray].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      
      // 문자열 값들은 trim 처리
      if (typeof aValue === 'string') aValue = aValue?.trim() || '';
      if (typeof bValue === 'string') bValue = bValue?.trim() || '';
      
      // 날짜 필드의 경우 Date 객체로 변환
      if (field === 'loanDate' || field === 'returnDate') {
        // null이나 빈 값 처리
        if (!aValue || aValue === '반납 안됨') aValue = new Date('9999-12-31'); // 반납 안된 경우 미래 날짜로 설정
        else aValue = new Date(aValue);
        
        if (!bValue || bValue === '반납 안됨') bValue = new Date('9999-12-31');
        else bValue = new Date(bValue);
      }
      
      // ID 필드의 경우 숫자로 변환
      if (field === 'id') {
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
    
    // 현재 이력 목록을 정렬
    const sortedHistories = sortHistories(histories, field, newDirection);
    setHistories(sortedHistories);
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

  const handleSearch = (e) => {
    e.preventDefault();
    loadHistory();
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
            <th className="border p-2">
              <button 
                onClick={() => handleSort('bookTitle')}
                className="flex items-center justify-center w-full hover:bg-gray-200 p-1 rounded"
              >
                도서 제목
                {renderSortIcon('bookTitle')}
              </button>
            </th>
            <th className="border p-2">
              <button 
                onClick={() => handleSort('username')}
                className="flex items-center justify-center w-full hover:bg-gray-200 p-1 rounded"
              >
                사용자 이름
                {renderSortIcon('username')}
              </button>
            </th>
            <th className="border p-2">
              <button 
                onClick={() => handleSort('loanDate')}
                className="flex items-center justify-center w-full hover:bg-gray-200 p-1 rounded"
              >
                대출일
                {renderSortIcon('loanDate')}
              </button>
            </th>
            <th className="border p-2">
              <button 
                onClick={() => handleSort('returnDate')}
                className="flex items-center justify-center w-full hover:bg-gray-200 p-1 rounded"
              >
                반납일
                {renderSortIcon('returnDate')}
              </button>
            </th>
            <th className="border p-2">
              <button 
                onClick={() => handleSort('status')}
                className="flex items-center justify-center w-full hover:bg-gray-200 p-1 rounded"
              >
                상태
                {renderSortIcon('status')}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {histories.map((h) => (
            <tr key={h.id} className="text-center">
              <td className="border p-2">{h.bookTitle}</td>
              <td className="border p-2">{h.username}</td>
              <td className="border p-2">{h.loanDate}</td>
              <td className="border p-2">{h.returnDate || '-'}</td>
              <td className={`border p-2 font-semibold`}>
                {getStatusBadge(h.status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}