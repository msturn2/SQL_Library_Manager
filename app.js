var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { sequelize } = require("./models");


var indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const errorRouter = require("./routes/error");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/static", express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

// Error Handling
app.use(errorRouter.fourZeroFourHandler);
app.use(errorRouter.globalErrorHandler);

sequelize.sync()
  .then(() => {
    app.listen(3001, () => {
      console.log("This app is running on localhost: 3001");
    });
  });

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connected to database!");
//   } catch (error) {
//     if (error.name === "SequelizeValidationError") {
//       const errors = error.errors.map(err => err.message);
//       console.error("Validation errors: ", errors);
//     } else {
//       throw error;
//     }
//   }
// }) ();

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
