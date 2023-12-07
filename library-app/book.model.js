const { Sequelize,DataTypes } = require('sequelize');
const sequelize = require('./sequelize-config');

const Book = sequelize.define('Books', {
  bookName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  takenDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  returnDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  finePrice: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

module.exports = Book;
