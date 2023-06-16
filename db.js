const mongoose = require('mongoose');

require('dotenv').config()

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.pvxunci.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
const options = { useNewUrlParser: true, useUnifiedTopology: true };

const dbConnect = mongoose.connect(uri, options)
  .then(() => console.log('Base de datos conectada'))
  .catch(e => console.log('error db:', e))

module.exports = dbConnect;