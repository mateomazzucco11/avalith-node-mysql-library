const express = require('express');
const connectionDb = require('../db/connect');

const app = express();


app.get('/library', (_, res) => {
    connectionDb.query('SELECT * FROM books', (err, result) => {
        if (err) {
            res
                .status(500)
                .json({ msg: 'Hubo un error' })
        }
        if (result.length === 0) {
            return res
                .status(204)
                .json({ msg: 'La libreria esta vacia' })
        }
        return res
            .status(200)
            .json({ msg: result })
    });
});

app.get('/library/:id', (req, res) => {
    const { id } = req.params;
    connectionDb.query('SELECT * FROM books WHERE id = ?', id, (err, result) => {
        if (err) {
            res.status(500).json({ msg: err });
        }
        if (result.length === 0) {
            return res
                .status(204)
                .json({ msg: `No hay registros del libro con el id: ${id}` })
        }
        return res.status(200).json({ msg: result })
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

    connectionDb.query('UPDATE books SET ? WHERE ID = ?', [dataChange, id], (err) => {
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

    connectionDb.query('DELETE FROM books WHERE ID = ?', id, (err, result) => {
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

module.exports = app;