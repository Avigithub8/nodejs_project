const express=require('express')
const bodyParser = require('body-parser')
const path = require("path");
const sequelize = require('./models/index');
const expenseModel = require('./models/expenseModel');
//const routes = require('./routes/userRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

//app.use('/', routes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);

sequelize.sync().then(() => {
    app.listen(3000);
  });