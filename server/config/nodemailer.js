const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const hbs = require('nodemailer-express-handlebars');

//transporter configuration
const transporter = nodemailer.createTransport(smtpTransport({
  from: process.env.EMAIL,
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
}));

transporter.use('compile', hbs({
  viewEngine: {
    extname: '.handlebars',
    layoutsDir: 'views/email/',
    defaultLayout: 'template',
    partialsDir: 'views/email/partials/'
  },
  viewPath: 'views/email/body',
  extName: '.handlebars'
}));

//veryfying transporter
transporter.verify((err, success) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Tranporter Connected');
  }
});

module.exports = transporter;
