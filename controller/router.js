const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const axios = require('axios');

const db = require('../models');

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

// get saved articles from the db
router.get('/saved-articles', (req, res) => {
  db.Article.find({}, (error, found) => {
    if (error) {
      console.log(error);
    }
    console.log(found);
    return found;
  }).then(found => {
    console.log(found);
    const articles = [];
    found.forEach(article => {
      articles.push(article);
    });
    const saved = {
      articles: articles
    };
    res.render('saved-articles', saved);
  });
});

// add a comment to an article
router.post('/add-comment/:id', (req, res) => {
  db.Comment.create(req.body).then(dbComment => {
    return db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { comments: dbComment._id } },
      { new: true }
    );
  });
});

// scrape article from link and send to the client
router.get('/article/:articleId', (req, res) => {
  // get the id of the article
  const articleId = req.params.articleId;
  // declare array to push the scraped article elements into
  const articleArr = [];

  // define object to send back to handlebars
  const articleObj = {
    paragraphs: []
  };

  // function making axios get request to the article link
  const scrapeArticle = link => {
    axios.get(link).then(response => {
      // $ to load the response data with cheerio
      const $ = cheerio.load(response.data);

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
        console.log(articleObj);
        res.send(articleObj);
      });
    });
  };

  db.Article.findById(articleId, (error, found) => {
    if (error) {
      console.log(error);
    }
    articleObj.comments = [];
    const articleLink = found.link;
    const articleComments = found.comments;
    articleComments.forEach(comment => {
      db.Comment.findById(comment, (error, found) => {
        if (error) {
          console.log(error);
        }
        console.log(found);
        if (found) {
          articleObj.comments.push({
            user: found.user,
            body: found.body,
            id: found.id
          });
        }
      });
    });

    return scrapeArticle(articleLink);
  });
});

router.delete('/article/:articleId', (req, res) => {
  // get the id of the article
  const articleId = req.params.articleId;
  db.Article.findByIdAndRemove(articleId, (error, res) => {
    console.log(res);
  });
});

router.delete('/comment/:commentId', (req, res) => {
  // get the id of the article
  const commentId = req.params.articleId;
  db.Comment.findByIdAndRemove(commentId, (error, res) => {
    console.log(res);
  });
});

module.exports = router;
