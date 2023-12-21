const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('expensetrack', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
 
});


module.exports = sequelize;
