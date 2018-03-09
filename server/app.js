const exhbs = require('express-handlebars');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

//adding dependencies
require('./config/config');
const nodemailer = require('./config/nodemailer');
const mongoose = require('./config/mongoose');

//initializing app
const app = express();

//Adding static folder
app.use(express.static(path.join(__dirname, '../public')));

//setting view engine
app.engine('handlebars', exhbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//setting up middlewares
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//load routes
const general = require('./routes/general');
const admin = require('./routes/admin');

//setting routes
app.use('/', general);
app.use('/admin', admin);

//setting port
const port = process.env.PORT;

//starting app
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('server running');
});
