const { DataTypes } = require("sequelize");
const sequelize = require("./index");
const ProductModel = require("./productModel");

const UserModel = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emailid: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

UserModel.hasMany(ProductModel, { foreignKey: 'userid' });
ProductModel.belongsTo(UserModel, { foreignKey: 'userid' });

module.exports = UserModel;
