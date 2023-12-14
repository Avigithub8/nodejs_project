const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('expensetrackerfbid', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;