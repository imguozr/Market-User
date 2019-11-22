var fn_home = async (ctx, next) => {
    if (!ctx.session.user) {
        ctx.response.redirect('/login');
    }
    var name = ctx.session.user;
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
};

module.exports = {
    'GET /home': fn_home
};
