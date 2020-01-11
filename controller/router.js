
const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const axios = require('axios');

const db = require('../models')

// load homepage and scrape specific articles off of slate
router.get('/', (req, res) => {
  axios.get('http://www.slate.com').then(response => {
    // $ to load the response data with cheerio
    const $ = cheerio.load(response.data);

    // array for the articles that will be scraped
    const articles = [];

    // for each article
    $('.story-teaser').each((i, element) => {
      // scrape the title
      const title = $(element)
        .find('h3')
        .attr('class', 'story-teaser__headline')
        .text();
      // scrape the link to the post
      const link = $(element)
        .find('a')
        .attr('href');
      // push the article title and link to the articles array
      articles.push({
        title: title,
        link: link
      });
    });

    // handlebars object
    const scraped = {
      articles: articles
    };
    res.render('home', scraped);
  });
});

// save specific article to db
router.post('/save-article', (req, res) => {
  // receive the article link in body of request
  // save the article in the database
  db.Article.create(req.body, (error, saved) => {
    if (error) {
      console.log(error);
    }
    res.json(saved);
  });
});

router.post('/article/:article', (req, res) => {
  console.log(req.body);
  db.Comment.create(req.body).then(dbComment => {
    return db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { comments: dbComment._id } },
      { new: true }
    );
  });
});

router.get('/saved-articles', (req, res) => {
  db.Article.find({}, (error, found) => {
    res.json(found);
  })
})

router.get('/article?:article', (req, res) => {
  // get the link to the article
  const articleLink = Object.keys(req.query)[0];
  // declare array to push the scraped article elements into
  const articleArr = [];

  // axios get request to the article link
  axios.get(articleLink).then(response => {
    // $ to load the response data with cheerio
    const $ = cheerio.load(response.data);
    const articleObj = {
      paragraphs: []
    };
    $('#main').each((i, element) => {
      // scrape the title
      const title = $(element)
        .find('.article__hed')
        .attr('itemprop', 'headline')
        .text();
      articleObj.title = title;

      // scrape the article paragraphs
      $('.article__content').each((i, element) => {
        let paragraph = $(element)
          .find('p')
          .attr('class', '.slate-paragraph')
          .text();

        const paragraphs = paragraph.split('\n');

        articleObj.paragraphs.push(paragraphs);
      });

      // push the article title and link to the articles array
      articleArr.push(articleObj);
      // send the article array as the response
      res.send(articleObj);
    });
  });
});

module.exports = router;
