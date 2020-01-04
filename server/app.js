require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const router = require('./router');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.set('view options', { layout: 'layout' });

mongoose.connect(
  `mongodb+srv://jayjs:${process.env.DB_PASSWORD}@cluster0-uudkd.mongodb.net/scrapednewsnetwork?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }
);

//middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', router);

module.exports = app;
