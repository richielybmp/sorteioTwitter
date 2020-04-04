const Twitter = require('twitter');
const config = require('./apiConfig');

const TwitterConfig = new Twitter(config);

module.exports = TwitterConfig;