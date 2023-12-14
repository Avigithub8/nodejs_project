const { DataTypes } = require("sequelize");
const sequelize = require("./index");
const UserModel = require("./UserModel");

const ProductModel = sequelize.define('expenses', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userid: {
    type: DataTypes.INTEGER, 
    allowNull: false,
  },
});


//ProductModel.belongsTo(UserModel, {as:'UserModel', foreignKey: 'userid' });


module.exports = ProductModel;
