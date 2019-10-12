var express = require('express');
var mysql = require('mysql2');
var dotenv = require('dotenv').config()
var router = express.Router();
/* MySQL Set Up */
const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_SCHEMA
});
function sanitizer(input) {
	var reg = /[&<>"'/\\]/ig;
	var map = {
		'<': '&lt;',
		'>': '&gt;',
		'&': '&amp;',
		'"':'&quot;',
		"'": '&#x27;',
		"/": '&#x2F;',
		"\\": '&#x5C;'
	};
	return input.replace(reg, (char)=>(map[char]));
}
/* GET users listing. */
router.get('/', function(req, res, next) {
	var uid = sanitizer(req.query.data)
	var query = "SELECT points FROM user WHERE email='" + uid + "'"
	connection.query(query, (err, rows) => {
		if (err) throw err;
		res.json(rows[0]);
	});
});

// router.post('/', function(req, res, next) {
// 	var item = sanitizer(req.body.data)
// 	var query = "UPDATE user SET points WHERE email='" + uid + "'"
// 	connection.query(query, (err, rows) => {
// 		if (err) throw err;
// 		res.json(rows);
// 	});
// });
module.exports = router;
