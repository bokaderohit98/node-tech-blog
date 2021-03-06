const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriberSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
  }
});

const Subscriber = mongoose.model('subscriber', SubscriberSchema);

module.exports = Subscriber;
