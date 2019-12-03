const Koa = require('koa');
const router = require('koa-router')();
const koaLogger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');

const index = require('./server/routers/index');
const user = require('./server/routers/user');
const github = require('./server/routers/github');
const stock = require('./server/routers/stock');
const stockExchange = require('./server/routers/stockExchange');

const app = new Koa();

app.use(koaLogger());

app.use(bodyParser());

app.use(cors());

router.use('/test', index.routes(), index.allowedMethods());
router.use('/user', user.routes(), user.allowedMethods());
router.use('/auth', github.routes(), github.allowedMethods());
router.use('/stock', stock.routes(), stock.allowedMethods());
router.use('/stock', stockExchange.routes(), stockExchange.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());

module.exports = app;

app.listen(3300, () => {
    console.log('App started at http://localhost:3300');
});
