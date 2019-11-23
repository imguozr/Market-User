var index = async (ctx, next) => {
    ctx.body = 'Hello!';
};

module.exports = (router) => {
    router.get('/index', index);
};
