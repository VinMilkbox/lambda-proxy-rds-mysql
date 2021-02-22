const mysql = require('mysql2'); //https://www.npmjs.com/package/mysql2
const pool = mysql.createPool({
	host     : process.env.DB_HOST,
	user     : process.env.DB_USER,
	database : process.env.DB_DATABASE,
	password : process.env.DB_PASSWD,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});
exports.lambdaHandler = async(event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
	pool.getConnection(function(err, connection) {
		if(err){
			console.log('error');
		}else{
			console.log('start connection');
			connection.query(
				'SELECT * FROM tasks',
				function(err, rows, fields) {
				if(err){
					console.log('error');
				} else {
					console.log('Connected!');
					console.log(rows);
				} 
				}
			);
			pool.releaseConnection(connection);
		}
	 });
};