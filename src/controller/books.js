const { nanoid } = require('nanoid');
const { books } = require('../collection/bookcollection');

const addBook = async (req, res) => {
  const reqData = req.body;
  // generated id with nanoid v3
  const generatedId = nanoid();

  // insertedat method to handle
  const insertedAt = new Date().toISOString();

  // updatedAt = inserted at create books
  const updatedAt = insertedAt;

  const isBookFinished = (reqData.readPage === reqData.pageCount);

  const addedBookDetail = {
    id: generatedId,
    name: reqData.name,
    year: reqData.year,
    author: reqData.author,
    summary: reqData.summary,
    publisher: reqData.publisher,
    pageCount: reqData.pageCount,
    readPage: reqData.readPage,
    finished: isBookFinished,
    reading: reqData.reading,
    insertedAt,
    updatedAt,
  };

  try {
    if (!addedBookDetail.name) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      }));
      return;
    }

    if (Number(addedBookDetail.readPage) > Number(addedBookDetail.pageCount)) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      }));
      return;
    }

    books.push(addedBookDetail);
    res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: addedBookDetail.id,
      },
    }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'fail',
      message: err.message,
    }));
  }
};

const viewAllBooks = (req, res) => {
  try {
    let filteredBooks = books;

    // handle if query is using name, handling non case-sensitive
    if (req.query && req.query.name) {
      filteredBooks = filteredBooks.filter(
        (book) => book.name.toLowerCase().includes(req.query.name.toLowerCase()),
      );
    }

    // handle if the query is using number 1 or 0, for finished boolean value
    if (req.query && req.query.finished) {
      const isFinished = req.query.finished;
      // use == to handle if it's number or string, to ensure value handling
      if (isFinished === '1' || isFinished === 1) {
        filteredBooks = filteredBooks.filter((book) => book.finished === true);
      } else if (isFinished === '0' || isFinished === 0) {
        filteredBooks = filteredBooks.filter((book) => book.finished === false);
      }
    }

    // handle if the query is using number 1 or 0, for reading boolean value
    if (req.query && req.query.reading) {
      const isReading = req.query.reading;
      if (isReading === '1' || isReading === 1) {
        filteredBooks = filteredBooks.filter((book) => book.reading === true);
      } else if (isReading === '0' || isReading === 0) {
        filteredBooks = filteredBooks.filter((book) => book.reading === false);
      }
    }
    // Map the complete books array to a simplified version with only id, name, and publisher
    const simplifiedBooks = filteredBooks.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'success',
      data: {
        books: simplifiedBooks,
      },
    }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'failed',
      message: err.message,
    }));
  }
};

const viewBookDetail = (req, res) => {
  const bookId = req.params.id;
  const foundBook = books.find((book) => book.id === bookId);
  if (foundBook) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'success',
      data: {
        book: foundBook,
      },
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }));
  }
};

const updateBookDetail = (req, res) => {
  const bookId = req.params.id;
  const updateBookData = req.body;

  if (!updateBookData.name) {
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }));
    return;
  }

  if (Number(updateBookData.readPage) > Number(updateBookData.pageCount)) {
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }));
    return;
  }

  const foundBook = books.find((book) => book.id === bookId);

  if (foundBook) { // we use the '=' operator because we want to update
    foundBook.name = updateBookData.name;
    foundBook.year = updateBookData.year;
    foundBook.author = updateBookData.author;
    foundBook.summary = updateBookData.summary;
    foundBook.publisher = updateBookData.publisher;
    foundBook.pageCount = updateBookData.pageCount;
    foundBook.readPage = updateBookData.readPage;
    foundBook.reading = updateBookData.reading;
    foundBook.updatedAt = new Date().toISOString();

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }));
  }
};

const deleteBookDetail = (req, res) => {
  const bookId = req.params.id;
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }));
  }
};

module.exports = {
  addBook,
  viewAllBooks,
  viewBookDetail,
  updateBookDetail,
  deleteBookDetail,
};
