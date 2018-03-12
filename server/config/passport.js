const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const Admin = require('../models/Admin');

module.exports = (passport) => {
  passport.use(new localStrategy({
      usernameField: 'email'
    },
    (email, password, done) => {
      Admin.findOne({
        email
      }).then((user) => {
        if (user) {
            if (user.password !== password) {
              return done(null, false, {
                message: 'Email and Password does not match.'
              });
            } else {
              return done(null, user);
            }
        } else {
          return done(null, false, {
            message: 'user not found'
          })
        }
      });
    }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Admin.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
