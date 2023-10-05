const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    const id = nanoid(16);
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
        reading,
        insertedAt,
        updatedAt,
    };

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });

        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });

        response.code(400);
        return response;
    }

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku Berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });

        response.code(201);
        return response;
    }
};

const getBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    if (books.length === 0) {
        const response = h.response({
            status: 'success',
            data: {
                books: [],
            },
        });
        response.code(200);
        return response;
    }

    let filterBookName = books;

    if (name !== undefined) {
        filterBookName = filterBookName.filter((book) => book.name.includes(name));
    }

    if (reading !== undefined) {
        filterBookName = filterBookName.filter((book) => book.reading === reading);
    }

    if (finished !== undefined) {
        filterBookName = filterBookName.filter((book) => book.finished === finished);
    }

    const response = h.response({
        status: 'success',
        data: {
            books: filterBookName.map((book) => ({
                id: book.id,
                publisher: book.publisher,
            })),
        },
    });

    response.code(200);
    return response;
};

const getDetailBookHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.find((n) => n.id === bookId)[0];

    if (book !== undefined) {
        return h.response({
            status: 'success',
            data: {
                book,
            },
        })
        .code(200);
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });

        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });

        response.code(400);
        return response;
    }

    const bookCode = books.findIndex((book) => book.id === bookId);
    books[bookCode] = {
        ...books[bookCode],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished: pageCount === readPage,
        updatedAt: new Date().toString(),
    };

    if (bookCode === -1) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });

        response.code(404);
        return response;
    }

    if (bookCode !== -1) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });

        response.code(200);
        return response;
    }
};

const deleteBookByIdHandler = (request, h) {
    const { bookId } = request.params;
    const bookCode = books.findIndex((book) => book.id === bookId);

    if (bookCode !== -1) {
        books.splice(bookCode, 1);
        const response = h.response ({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });

        response.code(200);
        return response;
    }

    if (bookCode === -1) {
        const response = h.response ({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan'
        });
    }
};

module.exports = {
    addBooksHandler, getBooksHandler, getDetailBookHandler, editBookByIdHandler, deleteBookByIdHandler
};