const Router = require('koa-router');

let github = new Router();
const githubController = require('../controllers/github.js');

githubController(github);

module.exports = github;
