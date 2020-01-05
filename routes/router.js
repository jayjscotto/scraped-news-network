const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');

const axios = require('axios');

router.get('/', (req, res) => {
  //do some cheerio and axios work
  //point axios at a url
  //use cheerio to scrape
  //put results in handlebars object
  //send to front end

  axios.get('http://www.nytimes.com').then(response => {
    //$ to load the response data with cheerio
    const $ = cheerio.load(response.data);

    //array for the articles that will be scraped
    const articles = [];

    //for each article
    $('article').each((i, element) => {
      //scrape the title
      const title = $(element)
        .children()
        .text();
      //scrape the link to the post
      const link = $(element)
        .find('a')
        .attr('href');
      //push the article title and link to the articles array
      articles.push({
        title: title,
        link: link
      });
    });

    //handlebars object
    const scraped = {
      articles: articles
    };
    //console.log(articles);
    res.render('home', scraped);
  });
});

module.exports = router;
