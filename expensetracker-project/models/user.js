const DataTypes  = require('sequelize');
const sequelize  = require('./index');
const Product=require('../models/product')

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: () => `user_${Date.now()}@example.com`, 
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '00000000',
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'random',
  },
  is_premium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  resetToken: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
});

User.hasMany(Product, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Product.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});





module.exports = User;

