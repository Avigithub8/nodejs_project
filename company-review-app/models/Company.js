const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Company = sequelize.define('companies', {
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pros: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  cons: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Company;
