const Router = require('koa-router');

let user = new Router();
const userController = require('../controllers/user.js');

userController(user);

module.exports = user;
