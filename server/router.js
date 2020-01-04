const express = require('express');
const router = express.router();


router.get('/', (req,res) => {
    //do some cheerio and axios work
    //point axios at a url
    //use cheerio to scrape
    //put results in handlebars object
    //send to front end
    res.render('main')
})