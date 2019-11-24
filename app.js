const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const controller = require('./server/controllers')
const session = require('koa-session');

const index = require('./server/routers/index')
const user = require('./server/routers/user')

const app = new Koa();
// app.keys = ['FK GFW'];

app.use(bodyParser());

router.use('/', index.routes(), index.allowedMethods())
router.use('/api', user.routes(), user.allowedMethods())

app.listen(3000);
console.log('App started at http://localhost:3000');
