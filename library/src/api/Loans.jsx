import axiosInstance from './AxiosInstance';

export const fetchUserById = async (userId) => {
  const response = await axiosInstance.get(`/user/${userId}`);
  console.log(response.data);
  return response.data
};

export const fetchLoansByUserId = async (userId) => {
  const response = await axiosInstance(`/loan/user/${userId}`);

  console.log("userId : ", userId);
  console.log("get Loans By user : ", response);

  return response.data;
};

export const fetchLoansByBookId = async (bookId) => {
  const response = await axiosInstance(`/loan/book/${bookId}`);

  console.log("bookId : ", bookId);
  console.log("get Loans By book : ", response);

  return response.data;
};

// 전체 이력 조회 (필터 optional)
export const fetchLoanHistory = async () => {
  const response = await axiosInstance.get('/loan');
  return response.data;
};

// 도서 대출
export const loanBook = async (loanData) => {
  const response = await axiosInstance.post('/loan', loanData);
  console.log("requested Loan Data : ", loanData);
  console.log("Add loan : ", response);

  return response.data;
};

// 도서 반납
export const returnBook = async (returnData) => {
  const response = await axiosInstance.put('/loan/return', returnData);
  console.log("requested : ", returnData);
  console.log("Add loan : ", response);

  return response.data;
};