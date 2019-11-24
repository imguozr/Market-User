const User = require('../models/User');
const rp = require('request-promise');
const createToken = require('../middlewares/createToken');
const checkToken = require('../middlewares/checkToken');
const url = require('../middlewares/url');

const Register = async (ctx) => {
    let result = {
        success: false,
        message: '',
        data: null
    };

    let post = ctx.request.body;
    await User.findOne({
        name: post.name
    }).then(user => {
        if (user) {
            result.message = 'Registered before!';
            ctx.body = result;
            return false;
        }
    }).catch(err => {
        ctx.body = err;
    });

    let userResult = await User.create({
        name: post.name,
        password: post.password,
        email: post.email,
        address: post.address,
        token: createToken(post.name)
    });
    if (userResult) {
        result.success = true;
        result.message = 'Login successfully';
        result.data = {
            name: post.name,
            email: post.email
        };
    }
    ctx.body = result;
};

const Login = async (ctx) => {
    let result = {
        success: false,
        message: '',
        data: null
    };
    let post = ctx.request.body;
    await User.findOne({
        name: post.name
    }).then(user => {
        if (!user) {
            result.message = 'No such user';
            ctx.body = result;
            return false;
        } else if (post.password === user.password) {
            result.success = true;
            result.message = 'Login Successfully!';
            result.data = {
                name: user.name,
                token: createToken(user.name)
            };
        } else {
            result.message = 'Wrong Password';
        }
    }).catch(err => {
        ctx.body = err;
    });
    ctx.body = result;
};

const GetToken = async (ctx) => {
    ctx.body = ctx.token;
};

module.exports = (router) => {
    router.post('/register', Register),
    router.post('/login', Login),
    router.get('/getToken', checkToken, GetToken)
}

