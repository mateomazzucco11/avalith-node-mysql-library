const express = require("express");
const app = express();

const booksRoutes = require('./Routes/books')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', booksRoutes);

module.exports = app;