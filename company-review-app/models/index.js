const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('company-review', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
