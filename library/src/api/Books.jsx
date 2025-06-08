// src/api/books.js
import axiosInstance from './AxiosInstance';

// 도서 검색
export const searchBooks = async (queryParams) => {
  const response = await axiosInstance.get('/books', { params: queryParams });
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

// src/api/books.js

// 도서 전체 조회 (관리자)
export const fetchBooks = async () => {
  const response = await axiosInstance.get('/admin/books');
  return response.data;
};

// 도서 등록
export const createBook = async (bookData) => {
  const response = await axiosInstance.post('/admin/books', bookData);
  return response.data;
};

// 도서 수정
export const updateBook = async (id, bookData) => {
  const response = await axiosInstance.put(`/admin/books/${id}`, bookData);
  return response.data;
};

// 도서 삭제 (선택)
export const deleteBook = async (id) => {
  const response = await axiosInstance.delete(`/admin/books/${id}`);
  return response.data;
};

