var express = require('express');
var router = express.Router();
const { Book } = require("../models");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

/* 
 * Handler function to wrap each route
 */
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
 * Error Handler
 */
const sendStatusCode = (errStatus, msg) => {
  const err = new Error(msg);
  err.status = errStatus;
  throw err;
};

/**
 * Shows the full list of books
 */
 router.get("/", asyncHandler(async (req, res) => {
  const page = req.query.page;

  // Redirects to page one as opposed to 0
  !page || page <= 0
  ? res.redirect("?page=1")
  : null;

  const booksPerPage = 10;
  const offset = (page - 1) * booksPerPage;
  
  // used findAndCountAll method to assist with
  // pagination; unpacked the methods count and 
  // rows objects
  const { count, rows } = await Book.findAndCountAll({
    order: [[ "title", "ASC" ]],
    limit: booksPerPage,
    offset
  });

  // Math.ceil used because pages start at 1
  const pageNumbers = Math.ceil(count / booksPerPage);

  // Redirects to last page if user enters 
  // page number greater than total number of 
  // pages
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
 * Search for a Book
 */
router.get("/search", asyncHandler(async (req, res) => {
  // stored search term in a destrutured variable
  const { term } = req.query;
  let page = req.query.page;

  // Redirect to page 1 because of indexing at page 0
  !page || page <= 0
  ? res.redirect(`?term=${term}&page=1`)
  : null;

  const booksPerPage = 10;
  const offset = (page - 1) * booksPerPage;
  
  const { count, rows } = await Book.findAndCountAll({
    order: [[ "title", "ASC" ]],
    // specified search conditioning
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${term}%`
          }
        },
        {
          author: {
            [Op.like]: `%${term}%`
          }
        },
        {
          genre: {
            [Op.like]: `%${term}%`
          }
        },
        {
          year: {
            [Op.like]: `%${term}%`
          }
        }
      ]
    },
    limit: booksPerPage,
    offset
  });

  // conditional to handle if there are no results
  if (count > 0) {
    const pageNumbers = Math.ceil(
      count / booksPerPage
    );
    page > pageNumbers
    ? res.redirect(`?term=${term}&page=${pageNumbers}`)
    : null;
  
    let pages = [];
    for (let i = 1; i <= pageNumbers; i++) {
      pages.push(i);
    }

    res.render(
      "index",
      { 
        books: rows, 
        title: "Search Results",
        pages,
        term
      }
    );
  } else {
    res.render(
      "no-search-results",
      {
        title: "Nothing Found",
        term
      }
    );
  }
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
 * Shows individulal book
 */
router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render(
      "show-book",
      { 
        book,
        title: "Upddate Book"
      }
    );
  } else {
    sendStatusCode(404, "Page Not Found");
  }
}));

/**
 * Update Book form
 */
 router.get("/:id/update", asyncHandler(async (req, res) => {
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
    sendStatusCode(404, "Page Not Found");
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
      sendStatusCode(404, "Page Not Found");
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
    sendStatusCode(404, "Page Not Found");
  }
}));


router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    sendStatusCode(404, "Page Not Found");
  }
}));

module.exports = router;