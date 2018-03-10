const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const admin = require('../models/Admin');

module.exports = (passport) => {
  passport.use(new localStrategy({
      adminnameField: 'email'
    },
    (email, password, done) => {
      Admin.findOne({
        email
      }).then((admin) => {
        if (admin) {
          bcrypt.compare(password, admin.password).then((result) => {
            if (!result) {
              return done(null, false, {
                message: 'Email and Password does not match.'
              });
            } else {
              return done(null, admin);
            }
          });
        } else {
          return done(null, false, {
            message: 'Admin not found'
          })
        }
      });
    }))

  passport.serializeUser(function(admin, done) {
    done(null, admin.id);
  });

  passport.deserializeUser(function(id, done) {
    admin.findById(id, function(err, admin) {
      done(err, admin);
    });
  });
};
