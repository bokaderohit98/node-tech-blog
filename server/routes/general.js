const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Mail = require('../models/Mail');
const Subscriber = require('../models/Subscriber');
const urlencode = require('../helpers/urlencode');

router.get('/', (req, res) => {
  Article.find({})
    .limit(5)
    .sort({
      date: -1
    })
    .then((articles) => {
      articles = urlencode(articles)
      res.render('general/index', {
        mainArticles: articles,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/articles', (req, res) => {
  var host = process.env.HOST;
  Article.find({})
    .sort({
      date: -1
    })
    .then((articles) => {
      articles = urlencode(articles);
      res.render('general/articles', {
        articles,
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
  var email = req.body.email;
  var name = req.body.name;
  var message = req.body.message;

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
});

router.get('/articles/:id', (req, res) => {
  var host = process.env.HOST;
  const id = req.params.id;
  Article.findById(id).then((article) => {
    article = urlencode(article);
    Article.find({
        _id: {
          $ne: article._id
        }
      })
      .sort({
        date: -1
      })
      .limit(4)
      .then((relatedArticles) => {
        relatedArticles = urlencode(relatedArticles);
        res.render('general/articlePage', {
          article,
          articles: relatedArticles,
          host
        });
      })
  }).catch((err) => {
    console.log(err);
    return;
  });
});

router.get('/subscribe', (req, res) => {
  res.render('general/subscribe');
})

router.post('/subscribe', (req, res) => {
  var name = req.body.name;
  var email = req.body.email;

  new Subscriber({
      name,
      email
    })
    .save((err) => {
      if (err) {
        console.log(err);
        return ;
      }
      req.flash('success_msg', "Added to the subscribe's list");
      res.redirect('/');
    });
});

module.exports = router;
