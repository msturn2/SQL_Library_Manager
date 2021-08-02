/**
 * Error Handlers
 */
const express = require("express");

// 404 Handler passes to Global Handler
const fourZeroFourHandler = (req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
};
  
// Global Error Handler
const globalErrorHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(err.status).render("page-not-found", { err });
  } else {
    err.status = 500;
    err.message = "Oh nooooo...., something has gone wrong! Internal Server Error.";
    res.status(err.status).render("error", { err });
  }
  
  console.error(err.status, err.message);
};

// Pass Error Handlers to app.js
module.exports = {
    fourZeroFourHandler,
    globalErrorHandler
};