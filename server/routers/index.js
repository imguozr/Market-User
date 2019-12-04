const Router = require('koa-router');

let index = new Router();
const indexController = require('../controllers/index.js');

indexController(index);

module.exports = index;
