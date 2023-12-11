const express=require('express')
const bodyParser = require('body-parser')
const path = require("path");
const sequelize = require('./models/index');
const expenseModel = require('./models/expenseModel');
const routes = require('./routes/userRoutes');


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/user/'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

sequelize.sync().then(() => {
    app.listen(3000);
  });