const fetch = require('node-fetch');
const User = require('../models/User');
const createToken = require('../middlewares/createToken');
const OAuthConfig = require('../../config/auth.config');

const GetGithub = async (ctx) => {
    let dataStr = (new Date()).valueOf();
    // redirect to github auth api
    let path = 'https://github.com/login/oauth/authorize';
    path += '?client_id=' + OAuthConfig.GITHUB_CLIENT_ID;
    path += '&scope=' + OAuthConfig.SCOPE;
    path += '&state=' + dataStr;
    ctx.redirect(path);
};

const GetGithubAccessToken = async (ctx, next) => {
    const code = ctx.request.query.code;
    let path = 'https://github.com/login/oauth/access_token';
    const params = {
        client_id: OAuthConfig.GITHUB_CLIENT_ID,
        client_secret: OAuthConfig.GITHUB_CLIENT_SECRET,
        code: code
    };
    await fetch(path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    }).then(res => {
        return res.text();
    }).then(body => {
        const args = body.split('&');
        let arg = args[0].split('=');
        const access_token = arg[1];
        console.log(body);
        console.log(access_token);
        return access_token;
    }).then(async (token) => {
        const url = ' https://api.github.com/user?access_token=' + token;
        console.log(url);
        await fetch(url)
            .then(res => {
                return res.json();
            })
            .then(async (res) => {
                let username = res.login;
                let result = {
                    registered: false,
                    data: null
                };
                await User.findOne({
                    where: {
                        username: username
                    }
                }).then(async (user) => {
                    if (!user) {
                        result.registered = false;
                        result.data = { username: res.login, email: res.email };
                        ctx.body = result;
                        return false;
                    } else {
                        result.registered = true;
                        let token = createToken(user.username);
                        user.token = token;
                        await user.save();
                        result.data = {
                            username: username,
                            token: token
                        };
                    }
                }).catch(err => {
                    ctx.body = err;
                });
                ctx.body = result;
            });
    }).catch(e => {
        console.log(e);
    });
};

module.exports = (router) => {
    router.get('/github', GetGithub);
    router.get('/github/callback', GetGithubAccessToken);
}
