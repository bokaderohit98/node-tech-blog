const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

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

//veryfying transporter
transporter.verify((err, success) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Tranporter Connected');
  }
});

module.exports = transporter;
