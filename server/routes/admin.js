const express = require('express');
const passport = require('passport');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

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
  res.render('admin/articles', {
    layout: 'admin',
  });
});

router.get('/subscribers', (req, res) => {
  res.render('admin/subscribers', {
    layout: 'admin',
  });
});

router.get('/interact', (req, res) => {
  res.render('admin/interact', {
    layout: 'admin',
  });
});

router.get('/articles/add', (req, res) => {
  res.render('admin/addArticle', {
    layout: 'admin',
  });
});

router.get('/articles/edit/:id', (req, res) => {
  res.render('admin/editArticle', {
    layout: 'admin',
  });
});

router.post('/articles/add', (req, res) => {
  //post article
});

router.put('/articles/edit/:id', (req, res) => {
  //edit put edited article
})

module.exports = router;
