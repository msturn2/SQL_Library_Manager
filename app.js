/**
 * Import dependencies
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { sequelize } = require("./models");

/**
 * Imported Routes
 */
var indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const errorRouter = require("./routes/error");

var app = express();

/**
 * View Engines
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/**
 * Middleware
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/static", express.static(path.join(__dirname, 'public')));

/**
 * Routes
 */
app.use('/', indexRouter);
app.use('/books', booksRouter);

/**
 * Sync sequelize
 */
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Successfully connected to the database");
  } catch (error) {
    console.log("Error occurred connecting to the database: ", error);
  }
}) ();

/**
 * Error Handling
 */
app.use(errorRouter.fourZeroFourHandler);
app.use(errorRouter.globalErrorHandler);

module.exports = app;