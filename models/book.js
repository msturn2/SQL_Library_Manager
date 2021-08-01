'use strict';
/**
 * Book Model auto build using sequelize CLI,
 * then customized to fit project needs
 */
const {
  Sequelize,
  Model
} = require('sequelize');
module.exports = (sequelize) => {
  class Book extends Model {};
  Book.init({
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false, // disallow null
      validate: {  
        notNull: { 
          msg: "Please provide a value for 'title'", 
        },
        notEmpty: { 
          msg: "Please provide a value for 'title'", 
        },
      },
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false, // disallow null
      validate: {  
        notNull: { 
          msg: "Please enter an Author's name", 
        },
        notEmpty: { 
          msg: "Please enter an Author's name", 
        },
      },
    },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER,
    wikiLink: Sequelize.STRING,
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};