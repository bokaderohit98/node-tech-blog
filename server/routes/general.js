const express = require('express');
const router = express.Router();

//for testing purpose only
var articles = [];
articles.push({
  title: 'Who won ipl',
  description: 'i dont have any idea about this thing but i will still speak',
});
articles.push({
  title: 'Who won cpl',
  description: 'i dont have any idea about this thing but i will still speak',
});
articles.push({
  title: 'Who won world cup 220',
  description: 'i dont have any idea about this thing but i will still speak',
});
articles.push({
  title: 'Who won nidahas trophy',
  description: 'i dont have any idea about this thing but i will still speak',
});
articles.push({
  title: 'Who won test match',
  description: 'i dont have any idea about this thing but i will still speak',
});


router.get('/', (req, res) => {
  //fetch recent articles from database
  res.render('general/index', {
    mainArticles: articles
  });
});

router.get('/articles', (req, res) => {
  //fetch all articles from data base
  res.render('general/articles', {
    articles
  });
});

router.get('/about', (req, res) => {
  res.render('general/about');
});

router.get('/contact', (req, res) => {
  res.render('general/contact');
});

router.post('/contact', (req, res) => {
  //add data to the database
  res.redirect('/');
});

router.get('/article/:id', (req, res) => {
  //fetch one article from database according to the id
  id = req.params.id;
  res.render('general/article', {
    article
  })
});

module.exports = router;
