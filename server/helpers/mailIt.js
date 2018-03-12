const transporter = require('../config/nodemailer');

module.exports = (req, res, mailOptions) => {
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      req.flash('error_msg', 'Some Error Occured!');
      res.redirect('/admin/');
      return;
    }
    req.flash('success_msg', 'Mail sent successfully!');
    res.redirect('/admin/');
  });
};
