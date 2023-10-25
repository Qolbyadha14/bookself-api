const { nanoid } = require('nanoid');
const books = require('./books');

const createResponse = (h, status, message, data = null, code = 200) => {
  const response = {
    status,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return h.response(response).code(code);
};

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (typeof name === 'undefined') {
    return createResponse(h, 'fail', 'Gagal menambahkan buku. Mohon isi nama buku', null, 400);
  }

  if (readPage > pageCount) {
    return createResponse(h, 'fail', 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', null, 400);
  }

  books.push(newBook);

  const isSuccess = books.some((book) => book.id === id);

  if (isSuccess) {
    return createResponse(h, 'success', 'Buku berhasil ditambahkan', { bookId: id }, 201);
  }

  return createResponse(h, 'error', 'Buku gagal ditambahkan', null, 500);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (books.length === 0) {
    return createResponse(h, 'success', 'Buku Tidak Tersedia', { books: [] });
  }

  let filterBook = books;

  if (typeof name !== 'undefined') {
    filterBook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (typeof reading !== 'undefined') {
    filterBook = books.filter((book) => Number(book.reading) === Number(reading));
  }

  if (typeof finished !== 'undefined') {
    filterBook = books.filter((book) => Number(book.finished) === Number(finished));
  }

  const listBook = filterBook.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return createResponse(h, 'success', 'Books retrieved successfully', { books: listBook });
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.find((n) => n.id === bookId);

  if (typeof book !== 'undefined') {
    return createResponse(h, 'success', 'Book retrieved successfully', { book });
  }

  return createResponse(h, 'fail', 'Buku tidak ditemukan', null, 404);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);

  if (typeof name === 'undefined') {
    return createResponse(h, 'fail', 'Gagal memperbarui buku. Mohon isi nama buku', null, 400);
  }

  if (readPage > pageCount) {
    return createResponse(h, 'fail', 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', null, 400);
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    return createResponse(h, 'success', 'Buku berhasil diperbarui');
  }

  return createResponse(h, 'fail', 'Gagal memperbarui buku. Id tidak ditemukan', null, 404);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return createResponse(h, 'success', 'Buku berhasil dihapus');
  }

  return createResponse(h, 'fail', 'Buku gagal dihapus. Id tidak ditemukan', null, 404);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
