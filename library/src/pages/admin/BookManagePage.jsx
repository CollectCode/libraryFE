// src/pages/admin/BookManagePage.jsx
import { useEffect, useState } from 'react';
import { fetchBooks, createBook, updateBook, deleteBook } from '../../api/Books';

export default function BookManagePage() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    author: '',
    publisher: '',
    year: '',
    price: '',
  });
  const [editingId, setEditingId] = useState(null);
  
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const data = await fetchBooks();
    setBooks(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateBook(editingId, form);
    } else {
      await createBook(form);
    }
    setForm({ title: '', author: '', publisher: '', year: '', price: '' });
    setEditingId(null);
    loadBooks();
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      year: book.year,
      price: book.price,
    });
    setEditingId(book.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteBook(id);
      loadBooks();
    }
  };

  return (
    <div className="p-6">
      <h2 className="w-[962px] text-xl font-bold mb-4">도서 관리</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-4 mb-6">
        <input
          type="text"
          placeholder="제목"
          className="border px-2 py-1 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="저자"
          className="border px-2 py-1 rounded"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="출판사"
          className="border px-2 py-1 rounded"
          value={form.publisher}
          onChange={(e) => setForm({ ...form, publisher: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="출간년도"
          className="border px-2 py-1 rounded"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="가격"
          className="border px-2 py-1 rounded"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-3 py-1"
        >
          {editingId ? '수정' : '등록'}
        </button>
      </form>

      <table className="w-full text-sm table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">제목</th>
            <th className="p-2 border">저자</th>
            <th className="p-2 border">출판사</th>
            <th className="p-2 border">출간년도</th>
            <th className="p-2 border">가격</th>
            <th className="p-2 border">작업</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="text-center">
              <td className="border p-2">{book.id}</td>
              <td className="border p-2">{book.title}</td>
              <td className="border p-2">{book.author}</td>
              <td className="border p-2">{book.publisher}</td>
              <td className="border p-2">{book.year}</td>
              <td className="border p-2">{book.price}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(book)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
