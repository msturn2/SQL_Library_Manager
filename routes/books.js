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
  const page = req.query.page;
  !page || page <= 0
  ? res.redirect("?page=1")
  : null;

  const booksPerPage = 10;
  const offset = (page - 1) * booksPerPage;
  
  const { count, rows } = await Book.findAndCountAll({
    order: [[ "title", "ASC" ]],
    limit: booksPerPage,
    offset
  });

  const pageNumbers = Math.ceil(count / booksPerPage);
  page > pageNumbers
  ? res.redirect(`?page=${pageNumbers}`)
  : null;

  let pages = [];
  for (let i = 1; i <= pageNumbers; i++) {
    pages.push(i);
  }

  res.render(
    "index",
    { 
      books: rows, 
      title: "Books",
      pages 
    }
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

/**
 * Posts a new book to the database
 */
router.post("/new", asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    // checking the error
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render(
        "new-book",
        {
          book,
          errors: error.errors,
          title: "New Book"
        }
      );
    } else {
      // error caught in the asyncHandler's catch block
      throw error;
    }
  }
}));

/**
 * Shows book detail form
 */
router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render(
      "update-book",
      { 
        book,
        title: "Update Book"
      }
    );
  } else {
    throw error;
  }
}));

/**
 * Updates book info in the database
 */
router.post("/:id", asyncHandler(async (req, res) => {
  let book;
  
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books/" + book.id);
    } else {
      throw error;
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);

      // make sure correct book gets updated
      book.id = req.params.id;
      res.render(
        "update-book", 
        { 
          book, 
          errors: error.errors, 
          title: "Update Book" 
        }
      );
    } else {
      throw error;
    }
  }
}));

/**
 * Delete book form
 */
router.get("/:id/delete", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render(
      "delete", 
      { book, title: "Delete Book" }
    );
  } else {
    throw error;
  }
}));


router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    throw error;
  }
}));

module.exports = router;
