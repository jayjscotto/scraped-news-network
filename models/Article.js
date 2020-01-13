const mongoose = require('mongoose');
const Comment = require('./Comment')
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    link: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;