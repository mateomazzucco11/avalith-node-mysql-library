const mysql = require('mysql');

const connectionDb = mysql.createConnection({
    host: 'localhost',
    database: 'library',
    user: 'root',
    password: 'root',
});

connectionDb.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('DataBase Connected')
    }
});

module.exports = connectionDb;