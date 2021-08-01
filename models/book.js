'use strict';

const {
  Sequelize,
  Model
} = require('sequelize');
module.exports = (sequelize) => {
  class Book extends Model {
    publishedAt() {
      const date = moment(this.createdAt)
                  .format("MMMM D, YYYY, h:mma");
      if (date !== null) {
        return date;
      }
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
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
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};