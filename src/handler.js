const { nanoid } = require('nanoid');
const books = require('./books');

//menambahkan BUKU post
const addBookHandler = (request, h) => {

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    if (!name) {
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



    const newBook = {
        name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updatedAt
    };
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

//menampilkan data get
// const getAllBooksHandler = (request, h) => {
//     const { name, publisher } = request.query;
//     // const isSuccess = books.filter((book) => book.id === id);
//     const isName = books.filter((book) => book.name === name);
//     const isPublish = books.filter((book) => book.publisher === publisher);

//     let filteredBooks = books;

//     if (reading) {
//         filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading));
//     }

//     if (finished) {
//         filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished));
//     }

//     if (isName) {
//         filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
//     }
//     const mappedBooks = filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher }));

//     return {
//         status: 'success',
//         data: {
//             books: filteredBooks,
//         },
//     };

// };

//menampilkan isi semua buku
// const getAllBooksHandler = () => ({
//     status: 'success',
//     data: {
//         books: books.map(book => ({
//             id: book.id,
//             name: book.name,
//             publisher: book.publisher
//         })),
//     },
// });


const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    let filteredBooks = books;

    if (name) {
        filteredBooks = filteredBooks.filter(book =>
            book.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    if (reading !== undefined) {
        const isReading = reading === 1;
        filteredBooks = filteredBooks.filter(book => book.reading === isReading);
    }

    if (finished !== undefined) {
        const isFinished = finished === 1;
        filteredBooks = filteredBooks.filter(book => book.finished === isFinished);
    }

    const mappedBooks = filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher }));

    const response = h.response({
        status: 'success',
        data: {
            books: mappedBooks,
        },
    });
    response.code(200);
    return response;
};


//mengambil buku dengan mencari id yang di masukan
const getBookByIdHandler = (request, h) => {

    const { id } = request.params;

    const book = books.filter((n) => n.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

//edit buku show id
const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);
    //mengecek jika nama tidak di isi
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    //mengecek jika readPage lebih besar dari pageCount maka gagal
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
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
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};


//delete
const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};


module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };