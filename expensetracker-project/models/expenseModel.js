const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const expenseModel = sequelize.define('expenses', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 emailid: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey:true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

});

module.exports = expenseModel;