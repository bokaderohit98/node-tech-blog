const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ArticleSchema = new Schema ({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  article: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Article = mongoose.model('article', ArticleSchema);

module.exports = Article;
