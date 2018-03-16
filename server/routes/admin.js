const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;

const ensureAuthenticated = require('../helpers/auth');
const mailIt = require('../helpers/mailIt');
const transporter = require('../config/nodemailer');

const Article = require('../models/Article');
const Subscriber = require('../models/Subscriber');
const Mail = require('../models/Mail');

router.get('/login', (req, res) => {
  res.render('admin/login', {
    layout: 'admin'
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: 'Invalid username or password',
  })(req, res, next);
});

router.get('/logout', ensureAuthenticated, (req, res) => {
  req.logout();
  req.flash('success_msg', 'You have been logged out');
  res.redirect('/admin/login');
});


router.get('/', ensureAuthenticated, (req, res) => {
  var object = {};

  Article.find({})
    .sort({
      date: -1
    })
    .limit(1)
    .then((article) => {
      object.article = article[0];

      Subscriber.find({})
        .sort({
          _id: -1
        })
        .limit(3)
        .then((subscribers) => {
          object.subscribers = subscribers;

          Mail.find({})
            .sort({
              _id: -1
            })
            .limit(1)
            .then((message) => {
              object.message = message[0];

              Subscriber.count({})
                .then((subscriberCount) => {
                  object.subscriberCount = subscriberCount;

                  Mail.count({})
                    .then((messageCount) => {
                      object.messageCount = messageCount;

                      res.render('admin/dashboard', {
                        layout: 'admin',
                        article: object.article,
                        subscriberCount: object.subscriberCount,
                        subscribers: object.subscribers,
                        message: object.message,
                        messageCount: object.messageCount
                      });
                    });
                });
            });
        });
    }).catch((err) => {
      console.log(err);
    });
});

router.get('/articles', ensureAuthenticated, (req, res) => {
  Article.find({})
    .sort({
      date: -1
    })
    .then((articles) => {
      res.render('admin/articles', {
        layout: 'admin',
        articles
      });
    }).catch((err) => {
      console.log(err);
    });
});

router.get('/articles/add', ensureAuthenticated, (req, res) => {
  res.render('admin/addArticle', {
    layout: 'admin',
  });
});

router.get('/articles/edit/:id', ensureAuthenticated, (req, res) => {
  Article.findById(req.params.id)
    .then((article) => {
      res.render('admin/editArticle', {
        layout: 'admin',
        article
      });
    }).catch((err) => {
      console.log(err);
    });
});

router.get('/articles/:id', ensureAuthenticated, (req, res) => {
  Article.findById(req.params.id)
    .then((article) => {
      res.render('admin/articlePage', {
        layout: 'admin',
        article
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/articles', ensureAuthenticated, (req, res) => {
  var article = {
    _id: new ObjectId(),
    title: req.body.title,
    description: req.body.description,
    img: req.body.img,
    article: req.body.article,
  };

  new Article(article)
    .save((err) => {
      if (err) {
        console.log(err);
        console.log('error occured');
      } else {
        Subscriber.find({})
          .then((subscribers) => {
            subscribers.forEach((subscriber) => {
              var from = `Team Technomaniac <${process.env.EMAIL}>`;
              transporter.sendMail({
                from,
                to: 'subscriber.email',
                subject: 'New Article',
                template: 'article',
                context: {
                  article,
                  subscriber
                }
              }, function(err, response) {
                if (err) {
                  console.log(err);
                  return;
                }
                console.log(response);
              });
            });
          }).catch((err) => {
            console.log(err);
          })
        req.flash('success_msg', 'Article is added');
        res.redirect('/admin/articles/');
      }
    });
});

router.put('/articles/:id', ensureAuthenticated, (req, res) => {
  var id = req.params.id;
  var article = {
    title: req.body.title,
    description: req.body.description,
    img: req.body.img,
    article: req.body.article
  };
  Article.findByIdAndUpdate(id, article, {
      new: true
    })
    .then((updatedArticle) => {
      req.flash('success_msg', 'Article updated');
      res.redirect(`/admin/articles/${id}`);
    }).catch((err) => {
      console.log(err);
    });
});

router.delete('/articles/:id', ensureAuthenticated, (req, res) => {

  Article.findByIdAndRemove(req.params.id)
    .then((deletedArticle) => {
      req.flash('success_msg', 'Article Deleted');
      res.redirect('/admin/articles');
    })
    .catch((err) => {
      console.log(err);
    })
});

router.get('/subscribers', ensureAuthenticated, (req, res) => {
  Subscriber.find({})
    .then((subscribers) => {
      res.render('admin/subscribers', {
        layout: 'admin',
        subscribers
      });
    })
    .catch((err) => {
      console.log(err);
    })
});

router.delete('/subscribers/:id', ensureAuthenticated, (req, res) => {
  Subscriber.findByIdAndRemove(req.params.id)
    .then((subscriber) => {
      res.redirect('/admin/subscribers');
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/messages', ensureAuthenticated, (req, res) => {
  Mail.find({})
    .then((messages) => {
      res.render('admin/messages', {
        layout: 'admin',
        messages
      });
    }).catch((err) => {
      console.log(err);
    });
});

router.delete('/messages/:id', ensureAuthenticated, (req, res) => {
  Mail.findByIdAndRemove(req.params.id)
    .then((subscriber) => {
      res.redirect('/admin/messages');
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/interact/:id', ensureAuthenticated, (req, res) => {
  res.render('admin/interact', {
    layout: 'admin',
    _id: req.params.id
  });
});

router.post('/interact', ensureAuthenticated, (req, res) => {
  var from = `Team Technomaniac <${process.env.EMAIL}>`;
  var to = req.body.email;
  var subject = req.body.subject;
  var text = req.body.message;

  if (to === 'bulk') {
    Subscriber.find({})
      .then((subscribers) => {
        subscribers.forEach((subscriber) => {
          transporter.sendMail({
            from,
            to: subscriber.email,
            subject,
            template: 'interact',
            context: {
              subscriber,
              message: text,
              subject,
            }
          }, function(err, response) {
            if (err) {
              console.log(err);
              return;
            }
            console.log(response);
            req.flash('success_msg', 'Mail sent successfully');
          });
        });
      }).catch((err) => {
        console.log(err);
      });
      res.redirect('/admin/');
  } else {
    Mail.findById(to, 'email -_id')
      .then((email) => {
        to = email;
        transporter.sendMail({
          from,
          to,
          subject,
          template: 'interact',
          context: {
            subject,
            message: text,
          }
        }, function(err, response) {
          if (err) {
            return;
          }
          console.log(response);
          req.flash('success_msg', 'Mail sent successfully');
        });
      }).catch((err) => {
        console.log(err);
      });
      res.redirect('/admin/');
  }
});


module.exports = router;
