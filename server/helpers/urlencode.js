const urlencode = require('urlencode');

module.exports = (articles) => {
  var host = process.env.HOST;
  if (Array.isArray(articles)) {
    articles.forEach((article) => {
      article.link = urlencode(host + `/articles/${article.id}`);
    });
  } else {
    articles.link = urlencode(host + `/articles/${articles.id}`);
  }
  return articles;
}
