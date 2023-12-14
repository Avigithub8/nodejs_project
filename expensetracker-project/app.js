const express=require('express')
const bodyParser = require('body-parser')
const path = require("path");
const sequelize = require('./models/index');
//const routes = require('./routes/userRoutes');
const userModel = require('./models/UserModel');
const productModel= require('./models/productModel');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const axios = require('axios');

// const cors = require('cors');


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cors());
//app.use('/', routes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);

//userModel.hasMany(productModel);
//productModel.belongsTo(userModel);

sequelize.sync().then(() => {
    app.listen(3000);
  });