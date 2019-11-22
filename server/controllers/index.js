var fn_index = async (ctx, next) => {
    ctx.response.body = `<h1>Index</h1>
        <form action="/login" method="post">
        <p>Name: <input name="name" value="koa"></p>
        <p>Passowrd: <input name="password" type="password"></p>
        <p><input type="submit" value="Submit"></p>
        </form>`;
};

var fn_login = async (ctx, next) => {
    var
        username = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`Sign in with name: ${username}, password: ${password}`);
    // TODO: Connect databse.
    if (username === 'koa' && password === 'admin') {
        ctx.session.user = username;
        ctx.body = { success: true, msg: 'Success! ' };
        ctx.response.redirect('/home')
    } else {
        ctx.body = { success: false, msg: 'Wrong username or password.' };
        ctx.response.redirect('/')
    }
};

var fn_logout = async (ctx, next) => {
    ctx.session = null;
    ctx.response.redirect('/');
};

module.exports = {
    'GET /': fn_index,
    'POST /login': fn_login,
    'GET /logout': fn_logout
}
