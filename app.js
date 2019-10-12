var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var brandsRouter = require('./routes/brands');
var productsRouter = require('./routes/products');
var rewardsRouter = require('./routes/rewards');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/brands', brandsRouter);
app.use('/products', productsRouter);
app.use('/rewards', rewardsRouter);

module.exports = app;
