const exhbs = require('express-handlebars');
const path = require('path');
const express = require('express');
const body_parser = require('body-parser');

//adding dependencies
require('./config/config');
const nodemailer = require('./config/nodemailer');
const mongoose = require('./config/mongoose');

//setting port
const port = process.env.PORT;

//initializing app
const app = express();

//setting view engine
app.engine('handlebars', exhbs({
  defaultLayout: 'main'
}));
app.set(view-engine, 'handlebars');

//setting up middle wares
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


//Home route
app.get('/', (req, res) => {
  res.send('App started');
});

//starting app
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('server running');
});
