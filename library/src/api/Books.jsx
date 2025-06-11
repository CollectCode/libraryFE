// src/api/books.js
import axiosInstance from './AxiosInstance';

// 페이지별 책 가져오기
export const getAllBooks = async (queryParams) =>  {
  const response = await axiosInstance.get(`/book/all/${queryParams}`);
  return response.data;
}

// BookId로 책 Detail조회
export const getBookById = async (bookId) => {
  const response = await axiosInstance.get(`/book/${bookId}`);
  return response.data;
}

// 도서 검색
export const searchBooks = async (queryParams) => {
  const response = await axiosInstance.get(`/book/all/${queryParams}`);
  return response.data;
};

// 도서 대출
export const borrowBook = async (bookId, userId) => {
  const response = await axiosInstance.post(`/borrow`, {
    bookId,
    userId,
  });
  return response.data;
};

// 도서 반납
export const returnBook = async (bookId, userId) => {
  const response = await axiosInstance.post(`/return`, {
    bookId,
    userId,
  });
  return response.data;
};

// 도서 등록
export const createBook = async (bookData) => {
  const response = await axiosInstance.post('/book/add', bookData);
  return response.data;
};

// 도서 수정
export const updateBook = async (id, bookData) => {
  console.log("update book : ", bookData);
  const response = await axiosInstance.put(`/book/update/${id}`, bookData);
  return response.data;
};

// 도서 삭제 (선택)
export const deleteBook = async (id) => {
  const response = await axiosInstance.delete(`/book/remove/${id}`);
  return response.data;
};

