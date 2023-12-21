const { DataTypes } = require('sequelize');
const  sequelize  = require('./index');
const User = require('./UserModel');

const Product = sequelize.define('Product', {
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'N/A',
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'N/A',
  },

});


module.exports = Product;

