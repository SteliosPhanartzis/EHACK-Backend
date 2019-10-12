var express = require('express');
var mysql = require('mysql2');
if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
var router = express.Router();
/* MySQL Set Up */
const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_SCHEMA
});

/* GET users listing. */
router.get('/', function(req, res, next) {
	connection.query('SELECT name FROM brands', (err, rows) => {
		if (err) throw err;
		res.json(rows);
	});
});

module.exports = router;
