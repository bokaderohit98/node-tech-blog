const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MailSchema = new Schema ({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Mail = mongoose.model('Mail', MailSchema);

module.exports = Mail;
