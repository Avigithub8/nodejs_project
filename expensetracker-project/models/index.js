
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('expensedb', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  
});

module.exports = sequelize;

