var index = async (ctx, next) => {
    ctx.body = `
    <h1>koa2 request post demo</h1>
    <form method="POST" action="/user/login">
      <p>userName</p>
      <input name="username" /><br/>
      <p>password</p>
      <input name="password" /><br/>
      <button type="submit">submit</button>
    </form>
  `;
};

module.exports = (router) => {
    router.get('/index', index);
};
