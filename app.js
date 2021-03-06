require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const logger = require('morgan');
const path = require('path');
const mongoose = require('mongoose');

const router = require('./controller/router');
const app = express();

  
 

mongoose.connection.once('open', function() {
  console.log(`Sucessfully Connected to Mongo DB !`); // If Connection is successful, Console.log(Message)
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.set('view options', { layout: 'layout' });


//middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));

app.use('/', router);

module.exports = app;
