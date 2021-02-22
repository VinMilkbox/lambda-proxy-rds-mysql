const mysql = require('mysql2'); //https://www.npmjs.com/package/mysql2
const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWD,
});
exports.lambdaHandler = async (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
	console.log('start connection');
	connection.query('SELECT * FROM tasks', function (err, results, fields) {
		if (err) {
			console.log('error');
		} else {
			console.log('Connected!'); // results contains rows returned by server
			console.log(results);
		}
	});
};
