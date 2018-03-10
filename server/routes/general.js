const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Mail = require('../models/Mail');

router.get('/', (req, res) => {
  Article.find({})
    .limit(5)
    .sort({
      date: -1
    })
    .then((articles) => {
      res.render('general/index', {
        mainArticles: articles
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/articles', (req, res) => {
  Article.find({})
    .sort({
      date: -1
    })
    .then((articles) => {
      res.render('general/articles', {
        articles
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/about', (req, res) => {
  res.render('general/about');
});

router.get('/contact', (req, res) => {
  res.render('general/contact');
});

router.post('/contact', (req, res) => {
  var errors = [];
  var email = req.body.email;
  var name = req.body.name;
  var message = req.body.message;

  if (email.length === 0) {
    errors.push({
      text: 'Email Required'
    });
  }

  if (name.length === 0) {
    errors.push({
      text: 'Name Required'
    });
  }
  if (message.length === 0) {
    errors.push({
      text: 'Message Required'
    });
  }

  if (errors.length === 0) {
    new Mail({
      email,
      name,
      message
    }).save((err) => {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash('success_msg', 'Thankyou for contacting us. We will get to you shortly.');
        res.redirect('/');
      }
    });
  } else {
    console.log(errors);
    res.render('general/contact', {
      errors,
      email,
      name,
      message
    });
  }
});

router.get('/articles/:id', (req, res) => {
  const host = process.env.HOST;
  const id = req.params.id;
  var articles = [];
  Article.findById(id).then((article) => {
    Article.find({
        date: {
          $lt: article.date
        }
      })
      .sort({
        date: -1
      })
      .limit(2)
      .then((lowers) => {
        lowers.forEach((lower) => {
          articles.push(lower);
        });
      })
      .catch((err) => {
        console.log(err);
      });

    Article.find({
        date: {
          $gt: article.date
        }
      })
      .sort({
        date: 1
      })
      .limit(2)
      .then((uppers) => {
        uppers.forEach((upper) => {
          articles.push(upper);
        });
      })
      .catch((err) => {
        console.log(err);
      });
    res.render('general/articlePage', {
      article,
      articles,
      host
    });
  }).catch((err) => {
    console.log(err);
    return;
  });
});

module.exports = router;
