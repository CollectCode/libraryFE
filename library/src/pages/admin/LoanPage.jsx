// src/pages/admin/LoanReturnPage.jsx
import { useState } from 'react';
import { loanBook, returnBook } from '../../api/Loans';

export default function LoanReturnPage() {
  const [activeTab, setActiveTab] = useState('loan');
  const [loanForm, setLoanForm] = useState({
    userId: '',
    bookId: ''
  });
  const [returnForm, setReturnForm] = useState({
    userId: '',
    bookId: ''
  });
  const [loading, setLoading] = useState(false);

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const loanData = {
        ...loanForm,
        loanDate: new Date().toISOString().split('T')[0] // 오늘 날짜
      };
      
      await loanBook(loanData);
      alert('대출이 완료되었습니다.');
      setLoanForm({ userId: '', bookId: '' });
    } catch (error) {
      alert('대출 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const returnData = {
        ...returnForm,
        returnDate: new Date().toISOString().split('T')[0] // 오늘 날짜
      };
      
      await returnBook(returnData);
      alert('반납이 완료되었습니다.');
      setReturnForm({ bookId: '' });
    } catch (error) {
      console.log(error);
      alert('반납 처리 중 오류가 발생했습니다.', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📚 대출 / 반납 관리</h1>
      
      {/* 탭 메뉴 */}
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'loan'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('loan')}
          >
            📖 도서 대출
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'return'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('return')}
          >
            📥 도서 반납
          </button>
        </div>
      </div>

      {/* 대출 폼 */}
      {activeTab === 'loan' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">도서 대출</h2>
          <form onSubmit={handleLoanSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사용자 ID
              </label>
              <input
                type="number"
                value={loanForm.userId}
                onChange={(e) => setLoanForm({...loanForm, userId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="사용자 ID를 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                도서 ID
              </label>
              <input
                type="number"
                value={loanForm.bookId}
                onChange={(e) => setLoanForm({...loanForm, bookId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="도서 ID를 입력하세요"
                required
              />
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">
                📅 대출일: {new Date().toLocaleDateString('ko-KR')}
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? '처리 중...' : '대출 처리'}
            </button>
          </form>
        </div>
      )}

      {/* 반납 폼 */}
      {activeTab === 'return' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">도서 반납</h2>
          <form onSubmit={handleReturnSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사용자 ID
              </label>
              <input
                type="number"
                value={returnForm.userId}
                onChange={(e) => setReturnForm({...returnForm, userId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="사용자 ID를 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                도서 ID
              </label>
              <input
                type="number"
                value={returnForm.bookId}
                onChange={(e) => setReturnForm({...returnForm, bookId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="반납할 도서 ID를 입력하세요"
                required
              />
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">
                📅 반납일: {new Date().toLocaleDateString('ko-KR')}
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading ? '처리 중...' : '반납 처리'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}