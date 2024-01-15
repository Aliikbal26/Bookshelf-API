const { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler } = require('./handler');

const routes = [
    //menambahkan buku
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler,
        options: {
            cors: {
                origin: ['*'],
            },
        },
    },
    //menampilkan semua buku
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler,
    },
    //edit buku berdasarkan id
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: editBookByIdHandler,
    },

    //show books id
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getBookByIdHandler,
    },
    //delete bouku
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: deleteBookByIdHandler,
    },
];


module.exports = routes;