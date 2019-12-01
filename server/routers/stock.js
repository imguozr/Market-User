const Router = require('koa-router');

let stock = new Router();
const stockController = require('../controllers/stock.js');

stockController(stock);

module.exports = stock;
