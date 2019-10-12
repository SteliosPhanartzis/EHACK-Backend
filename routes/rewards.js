var express = require('express');
var mysql = require('mysql2');
var multer = require('multer');
var upload = multer({dest: __dirname + '/../public/images'});
var jsBarcodeReader = require('javascript-barcode-reader')
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
	var uid = sanitizer(req.query.data)
	var query = "SELECT points FROM user WHERE email='" + uid + "'"
	connection.query(query, (err, rows) => {
		if (err) throw err;
		res.json(rows[0]);
	});
});

router.post('/', upload.single('barcode'),async function(req, res, next) {
	var code = 0;
	var user = "testuser@gmail.com";
	if(req.file) {
		Image = req.file.path
		try {
		  code = await jsBarcodeReader(
		    Image /* Image ID || HTML5 Image || HTML5 Canvas || HTML5 Canvas ImageData || Image URL */,
		    {
		      barcode: 'ean-13',
		      type: 'industrial', //optional type
		    }
		  )
		  console.log(code)
			var query = "UPDATE user SET points=points+(SELECT retPoints from Item WHERE prodId =" + code + " ) WHERE email='" + user + "'"
			connection.query(query, (err, rows) => {
				if (err) throw err;
			});
		} catch (err) {
		  console.log(err)
		}
	}
	var qry = "SELECT points FROM user WHERE email = '" + user + "'";
	connection.query(qry, (err, rows) => {
		if (err) throw err;
		res.json(rows[0]);
	});
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
module.exports = router;
