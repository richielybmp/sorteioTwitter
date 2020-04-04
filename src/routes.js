const express = require('express');

const TweetsController = require('./controllers/TweetsController');

const routes = express.Router();

routes.get('/tweets', TweetsController.index);
routes.get('/tweets/:id', TweetsController.getTweet);

module.exports = routes;