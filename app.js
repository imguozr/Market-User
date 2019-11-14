const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const controller = require('./controller')
const session = require('koa-session');

const app = new Koa();
app.keys = ['FK GFW'];

app.use(async (ctx, next) => {
    console.log(`Processing ${ctx.request.method} ${ctx.request.url}`);
    await next();
});

app.use(session({
    app: 'koa:sess',
    maxAge: 54000,
    overwrite: true,
    httpOnly: true,
    signed: true
}, app));

app.use(bodyParser());

app.use(controller());

app.listen(3000);
console.log('App started at http://localhost:3000');
