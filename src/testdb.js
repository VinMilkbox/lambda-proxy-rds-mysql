// This to test locally.
require('dotenv').config();
const mysql = require('mysql2');

console.log('start connection');
const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWD,
});

connection.query('SELECT * FROM tasks', function (err, results, fields) {
	if (err) {
		console.log('error');
	} else {
		console.log('Connected!'); // results contains rows returned by server
		console.log(results);
	}
});

connection.end();
