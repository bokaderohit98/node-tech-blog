const mongoose = require('mongoose');

//getting mongodb uri
const url = process.env.MONGODB_URI;

mongoose.promise = global.promise;

//connecting to database
mongoose.connect(url).then(() => {
  console.log("connected to mongodb");
}).catch((err) => {
  console.log(err);
});

module.exports = mongoose;
