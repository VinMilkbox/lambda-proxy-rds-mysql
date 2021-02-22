const AWS = require('aws-sdk');
const mysql2 = require('mysql2'); //https://www.npmjs.com/package/mysql2
const fs = require('fs');

let connection;

//@vins ---start--- - i assume we dont need this to be invoked on every hanlder invokation? or do we?
var signer = new AWS.RDS.Signer({
	region: process.env.REGION, // example: us-east-2
	hostname: process.env.DB_HOST,
	port: 3306,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWD,
});

let token = signer.getAuthToken({
	username: process.env.DB_USER,
	password: process.env.DB_PASSWD,
});

console.log('IAM Token obtained\n');

let connectionConfig = {
	host: process.env.DB_HOST, // Store your endpoint as an env var
	user: process.env.DB_USER,
	database: process.env.DB_DATABASE, // Store your DB schema name as an env var
	ssl: { rejectUnauthorized: false },
	password: token,
	authSwitchHandler: function ({ pluginName, pluginData }, cb) {
		console.log('Setting new auth handler.');
	},
};

// Adding the mysql_clear_password handler
connectionConfig.authSwitchHandler = (data, cb) => {
	if (data.pluginName === 'mysql_clear_password') {
		// See https://dev.mysql.com/doc/internals/en/clear-text-authentication.html
		console.log('pluginName: ' + data.pluginName);
		let password = token + '\0';
		let buffer = Buffer.from(password);
		cb(null, password);
	}
};
//@vins ---start--- - i assume we dont need this to be invoked on every hanlder invokation? or do we?

exports.handler = async (event) => {
	//@vins - why do we need this wrapping promise?
	const promise = new Promise(function (resolve, reject) {
		console.log('Starting query ...\n');
		console.log('Running iam auth ...\n');

		//@vins - do we want a connection on each invokation of handler?
		connection = mysql2.createConnection(connectionConfig);

		//@vins - do we want do connect() on each invokation of handler?
		connection.connect(function (err) {
			if (err) {
				console.log('error connecting: ' + err.stack);
				return;
			}

			console.log('connected as id ' + connection.threadId + '\n');
		});

		//@vins - use mysql2/promise lib, which should allow u to do
		//@vins - const result = await connection.query('SELECT * FROM tasks')
		connection.query('SELECT * FROM tasks', function (error, results, fields) {
			if (error) {
				//throw error;
				reject('ERROR ' + error);
			}
			console.log(results);
		});
	});
	return promise;
};
