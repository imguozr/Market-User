const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const controller = require('./server/controllers')
const session = require('koa-session');

const index = require('./server/routers/index')
const user = require('./server/routers/user')

const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

app.use(bodyParser());

router.use('', index.routes(), index.allowedMethods())
router.use('/user', user.routes(), user.allowedMethods())
app.use(router.routes()).use(router.allowedMethods())

module.exports = app;

// app.listen(3000, () => {
//     // console.log('[demo] test-unit is starting at port 3000')
//     console.log('App started at http://localhost:3000');
// });

