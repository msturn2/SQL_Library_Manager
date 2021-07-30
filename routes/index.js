var express = require('express');
var router = express.Router();

/* GET home page and redirect to 
 * routes/book
 */
router.get('/', (req, res, next) => {
  res.redirect("/books")
});

module.exports = router;


// const express = require('express');
// const router = express.Router();

// /* Get home page
//    Redirect to routes/books.js
// */
// router.get('/', (req, res, next) => {
//   res.redirect("/books")
// });

// module.exports = router;