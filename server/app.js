const exhbs = require('express-handlebars');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const flash = require('connect-flash');

//adding dependencies
require('./config/config');
const nodemailer = require('./config/nodemailer');
const mongoose = require('./config/mongoose');

//Passport Config
require('./config/passport')(passport);

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
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Global variables Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

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
