const Router = require('koa-router');

let stockEx = new Router();
const stockExController = require('../controllers/stockExchange.js');

stockExController(stockEx);

module.exports = stockEx;
