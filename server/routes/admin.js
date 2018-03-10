const express = require('express');
const passport = require('passport');
const router = express.Router();
const {
  ensureAuthenticated
} = require('../helpers/auth');
const Article = require('../models/Article');
const Subscriber = require('../models/Subscriber');

router.get('/login', (req, res) => {
  res.render('admin/login', {
    layout: 'admin'
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/admin/login',
    failureFlash: true
  })(req, res, next);
})

router.get('/', (req, res) => {
  res.render('admin/dashboard', {
    layout: 'admin',
  });
});

router.get('/articles', (req, res) => {
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

router.get('/articles/add', (req, res) => {
  res.render('admin/addArticle', {
    layout: 'admin',
  });
});

router.get('/articles/edit/:id', (req, res) => {
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

router.post('/articles', (req, res) => {
  var errors = [];
  var article = {
    title: req.body.title,
    description: req.body.description,
    img: req.body.img,
    article: req.body.article
  };

  if (article.title.length === 0) {
    errors.push({
      text: 'Title is required'
    });
  }

  if (article.description.length === 0) {
    errors.push({
      text: 'Description is required'
    });
  }

  if (article.article.length === 0) {
    errors.push({
      text: 'Article is required'
    });
  }

  if (errors.length > 0) {
    res.render('admin/editArticle', {
      errors,
      article
    });
  } else {
    var newArticle = new Article(article)
      .save((err) => {
        if (err) {
          console.log(err);
        } else {
          req.flash('success_msg', 'Article is added');
          res.redirect('/admin/articles');
        }
      });
  }
});

router.put('/articles/:id', (req, res) => {
  var errors = [];
  var id = req.params.id;
  var article = {
    title: req.body.title,
    description: req.body.description,
    img: req.body.img,
    article: req.body.article
  };

  if (article.title.length === 0) {
    errors.push({
      text: 'Title is required'
    });
  }

  if (article.description.length === 0) {
    errors.push({
      text: 'Description is required'
    });
  }

  if (article.article.length === 0) {
    errors.push({
      text: 'Article is required'
    });
  }

  if (errors.length > 0) {
    res.render('admin/editArticle', {
      errors,
      article
    });
  } else {
    Article.findByIdAndUpdate(id, article, {
        new: true
      })
      .then((udatedArticle) => {
        req.flash('success_msg', 'Article updated');
        res.redirect('/admin/articles/' + id);
      }).catch((err) => {
        console.log(err);
      });
  }
});

router.delete('/articles/:id', (req, res) => {

  Article.findByIdAndRemove(req.params.id)
    .then((deletedArticle) => {
      req.flash('success_msg', 'Article Deleted');
      res.redirect('/admin/articles');
    })
    .catch((err) => {
      console.log(err);
    })
});

router.get('/subscribers', (req, res) => {
  Subscriber.find({})
    .then((subscribers) => {
      console.log(subscribers);
      res.render('admin/subscribers', {
        layout: 'admin',
        subscribers
      });
    })
    .catch((err) => {
      console.log(err);
    })
});

router.delete('/subscribers/:id', (req, res) => {
  Subscriber.findByIdAndRemove(req.params.id)
  .then((subscriber) => {
    req.flash('success_msg', 'Subscriber deleted');
    res.redirect('/admin/subscribers');
  })
  .catch((err) => {
    console.log(err);
  });
})

router.get('/interact', (req, res) => {
  res.render('admin/interact', {
    layout: 'admin',
  });
});



module.exports = router;
