
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('expense_db', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  
});

module.exports = sequelize;

