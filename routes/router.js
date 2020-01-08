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
  //get the link to the article
  const articleLink = Object.keys(req.query)[0];
  //declare array to push the scraped article elements into
  const articleArr = [];

  //axios get request to the article link
  axios.get(articleLink).then(response => {
    //$ to load the response data with cheerio
    const $ = cheerio.load(response.data);
    const articleObj = {
        paragraphs: []
    }
    $('#main').each((i, element) => {

      //scrape the title
      const title = $(element)
        .find('.article__hed')
        .attr('itemprop', 'headline')
        .text();
        articleObj.title = title;

      //scrape the article paragraphs
      $('.article__content').each((i, element) => {
        const paragraph = $(element)
        .find('p')
        .attr('class', '.slate-paragraph')
        .text();
        
        articleObj.paragraphs.push(paragraph);
      })
     
        console.log(articleObj)
      //push the article title and link to the articles array
      articleArr.push(articleObj);
      //send the article array as the response
      res.send(articleObj);
    });
  });
});

module.exports = router;
