var express = require('express');
var router = express.Router();
const { Book } = require("../models");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

/* Handler function to wrap each route. */
function asyncHandler(callback) {
  return async(req, res, next) => {
    try {
      await callback(req, res, next)
    } catch(error) {
      // Forward error to the global error handler
      next(error);
    }
  }
}

/**
 * Shows the full list of books
 */
router.get("/", asyncHandler(async (req, res) => {
  const page = req.query.page || 0;
  const booksPerPage = 10;
  const offset = page * booksPerPage;
  
  const { count, rows } = await Book.findAndCountAll({
    order: [[ "title", "ASC" ]],
    limit: booksPerPage,
    offset
  });

  const pageNumbers = Math.ceil(count / booksPerPage);

  const pages = [];
  for (let i = 1; i <= pageNumbers; i++) {
    pages.push(i);
  }

  // res.json(books);

  res.render(
    "index",
    { books: rows, title: "Books", pages },
  );
}));

/**
 * Shows the create new book form
 */
router.get("/new", asyncHandler(async (req, res) => {
  res.render(
    "new-book",
    { book: {}, title: "Add New Book" }
  );
}));



// router.get();
// router.post();
// router.get();
// router.post();
// router.get();

module.exports = router;
