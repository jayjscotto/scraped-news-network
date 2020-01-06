const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');

const axios = require('axios');

router.get('/', (req, res) => {
  //point axios at a url
  //use cheerio to scrape
  //put results in handlebars object
  //send to front end

//   axios.get('http://www.nytimes.com').then(response => {
//     //$ to load the response data with cheerio
//     const $ = cheerio.load(response.data);

//     //array for the articles that will be scraped
//     const articles = [];

//     //for each article
//     $('article').each((i, element) => {
//       //scrape the title
//       const title = $(element)
//         .children()
//         .text();
//       //scrape the link to the post
//       const link = $(element)
//         .find('a')
//         .attr('href');
//       //push the article title and link to the articles array
//       articles.push({
//         title: title,
//         link: link
//       });
//     });

//     //handlebars object
//     const scraped = {
//       articles: articles
//     };

axios.get('http://www.slate.com').then(response => {
    //$ to load the response data with cheerio
    const $ = cheerio.load(response.data);

    //array for the articles that will be scraped
    const articles = [];

    //for each article
    $('.story-teaser').each((i, element) => {
      //scrape the title
      const title = $(element)
        .find('h3')
        .attr('class', 'story-teaser__headline')
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

router.get('/article?:article', (req, res) => {
  console.log(Object.keys(req.query)[0]);
  //const article = req.params.article.split('').slice(9).join('')
  
//   axios.get('http://nytimes.com' + article).then(response => {
//     //$ to load the response data with cheerio
//     const $ = cheerio.load(response.data);

//   });

res.status(200).send()
});

module.exports = router;
