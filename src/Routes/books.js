const express = require('express');
const connectionDb = require('../db/connect');

const app = express();

app.get('/library', (_, res) => {
    connectionDb.query('SELECT * FROM books INNER JOIN authors ON books.id_author = authors.id_author', (err, result) => {

        if (err) {
            res
                .status(500)
                .json({ msg: 'Hubo un error' })
        }
        if (result.length === 0) {
            return res
                .status(204)
                .json({ msg: 'La libreria esta vacia' })
        } else {
            const data = result.map((book) => ({
                id: book.id,
                title: book.title,
                isbn: book.isbn,
                author: {
                    id: book.id_author,
                    name: book.author_name,
                    nacionality: book.author_nationality,
                },
            }));

            res.status(200).json(data);
        }
    });
});

app.get('/library/:id', (req, res) => {
    const { id } = req.params;

    connectionDb.query('SELECT * FROM books INNER JOIN authors ON books.author_id = authors.id_author WHERE id = ?', id, (err, result) => {

        if (err) {
            res.status(500).json({ msg: err });
        }
        if (result.length === 0) {
            return res
                .status(204)
                .json({ msg: `No hay registros del libro con el id: ${id}` })
        } else {
            const data = result.map((book) => ({
                id: book.id,
                name: book.title,
                isbn: book.isbn,
                author: {
                    id: book.id_author,
                    name: book.author_name,
                    nacionality: book.author_nationality
                },
            }));

            res.status(200).json(data);
        }
    })
})

app.post('/library', (req, res) => {
    const newBook = req.body;

    connectionDb.query('INSERT INTO books SET ?', newBook, (err) => {
        if (err) {
            res.status(500).json({ msg: 'Hay error en la escritura' })
        }

        res.status(200).json({ msg: 'Libro creado correctamente' })
    })
});

app.put('/library/:id', (req, res) => {
    const dataChange = req.body;
    const { id } = req.params;

    connectionDb.query('UPDATE books SET ? WHERE id = ?', [dataChange, id], (err) => {
        if (err) {
            return res.status(500).json({ msg: 'Hubo un error al intentar modificar el libro' })
        }
        return res
            .status(200)
            .json({ msg: 'El libro se modifico correctamente.' })
    });
});

app.delete('/library/:id', (req, res) => {
    const { id } = req.params;

    connectionDb.query('DELETE FROM books WHERE id = ?', id, (err, result) => {
        if (err) {
            return res.status(500).json({ msg: 'Error al tratar de eliminar el libro' })
        }
        if (result === 0) {
            return res
                .status(204)
                .json({ msg: `No existe el libro con el id ${id}` })
        }
        return res.send(`El libro con el id ${id} fue borrado correctamente.`)
    })
})

// AUTHORS

app.get('/authors', (_, res) => {
    connectionDb.query('SELECT * FROM authors', (err, result) => {
        if (err) {
            res.status(500).json({ msg: 'DB Error' })
        } else if (result.length == 0) {
            res.status(404).json({ msg: 'No se encontro el autor' });
        } else {
            res.status(200).json();
        }
    })
})

app.post('/author/:id', (req, res) => {
    const { id } = req.params;

    connectionDb.query('SELECT * FROM authors WHERE id_author = ?', id, (err, result) => {
        if (err) {
            res.status(500).json({ msg: 'DB Error' });
        } else if (result.length == 0) {
            res.status(404).json({ msg: 'El autor solicitado no existe' });
        } else {
            res.status(200).json(result)
        }
    });
});

app.post('/author', (req, res) => {
    const { author_name, author_nationality } = req.body;

    connectionDb.query(`INSERT INTO authors (author_name, author_nationality) VALUES ('${author_name}', '${author_nationality}')`, (err, result) => {
        if (err) {
            res.status(500).json({ msg: 'DB Error' })
        } else {
            res.status(200).json({ msg: 'El author fue agregado con exito' })
        }
    });
});

app.put('/author/:id', (req, res) => {
    const { id } = req.params;
    const { author_name, author_nationality } = req.body;

    connectionDb.query(`UPDATE authors SET author_name = '${author_name}', author_nationality = '${author_nationality}' WHERE id_author = ${id}`, (err, result) => {
        if (err) {
            res.status(500).json({ msg: 'DB Error' });
        } else {
            res.status(200).json({ msg: 'El author se modifico correctamente' })
        }
    })

})

module.exports = app;