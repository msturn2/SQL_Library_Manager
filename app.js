/**
 * Imports
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
sequelize.sync()
  .then(() => {
    app.listen(3001, () => {
      console.log("This app is running on localhost: 3001");
    });
  });

/**
 * 404 Handler passes to Global Handler
 */
app.use(function (req, res, next) {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

/**
 * Global Error Handler
 */
app.use(function (err, req, res, next) {
  if (err.status === 404) {
    res.status(err.status).render("page-not-found", { err });
  } else {
    err.status = 500;
    err.message = "Oh nooooo...., something has gone wrong! Internal Server Error.";
    res.status(err.status).render("error", { err });
  }

  console.error(err.status, err.message);
});

module.exports = app;