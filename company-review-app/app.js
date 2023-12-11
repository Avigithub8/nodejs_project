const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const sequelize = require('./models/index');
const company = require('./models/Company');
const routes = require('./routes');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));

app.use('/', routes);


sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
