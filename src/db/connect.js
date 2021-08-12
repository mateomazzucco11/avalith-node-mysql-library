const mysql = require('mysql');

const connectionDb = mysql.createConnection({
    host: 'localhost',
    database: 'library',
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
});

connectionDb.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('DataBase Connected')
    }
});

module.exports = connectionDb;