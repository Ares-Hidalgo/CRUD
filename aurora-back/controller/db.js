const mysql = require('mysql2');

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aurora'
});

module.exports = db;
