const User = require('../models/User');
const createToken = require('../middlewares/createToken');
const checkToken = require('../middlewares/checkToken');


const Register = async (ctx) => {
    let result = {
        success: false,
        message: '',
        data: null
    };

    let post = ctx.request.body;
    await User.findOne({
        where: {
            username: post.username
        }
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
        username: post.username,
        password: post.password,
        email: post.email,
        address: post.address,
        token: createToken(post.username)
    }).catch(err => {
        ctx.body = err;
    });
    if (userResult) {
        result.success = true;
        result.message = 'Registered successfully';
        result.data = {
            username: post.username,
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
        where: {
            username: post.username
        }
    }).then(async (user) => {
        if (!user) {
            result.message = 'No such user.';
            ctx.body = result;
            return false;
        } else if (post.password === user.password) {
            let token = createToken(user.username);
            user.token = token;
            await user.save();
            result.success = true;
            result.message = 'Login Successfully!';
            result.data = {
                username: user.username,
                token: token
            };
        } else {
            result.message = 'Wrong Password.';
        }
    }).catch(err => {
        ctx.body = err;
    });
    ctx.body = result;
};

const LogOut = async (ctx) => {
    let result = {
        success: false,
        message: ''
    }
    let post = ctx.request.body;
    await User.findOne({
        where: {
            username: post.username
        }
    }).then(async (user) => {
        if (!user || !user.token) {
            result.message = 'No such user or have logged out already.'
            ctx.body = result;
            return false;
        } else {
            user.token = null;
            await user.save();
            result.success = true;
            result.message = 'Logged out successfully.'
        }
    }).catch(err => {
        ctx.body = err;
    });
    ctx.body = result;
};

const ForgotPassword = async (ctx) => {
    let result = {
        success: false,
        message: ''
    };
    let post = ctx.request.body;
    await User.findOne({
        where: {
            username: post.username
        }
    }).then(async (user) => {
        if (!user) {
            result.message = 'No such user.'
            ctx.body = result;
            return false;
        } else if (user.token === null) {
            result.message = 'Please login.'
            ctx.body = result;
            return false;
        } else if (user.password === post.oldPassword) {
            user.password = post.newPassword;
            user.token = null;
            await user.save();
            result.success = true;
            result.message = 'Reset password successfully, please re-login.'
        } else {
            result.message = 'Wrong password.'
        }
    }).catch(err => {
        ctx.body = err;
    });
    ctx.body = result;
};

const UpdateProfile = async (ctx) => {
    let result = {
        success: false,
        message: '',
        data: null
    };
    let post = ctx.request.body;
    await User.findOne({
        where: {
            username: post.username
        }
    }).then(async (user) => {
        if (!user) {
            result.message = 'No such user.'
            ctx.body = result;
            return false;
        } else if (user.token === null) {
            result.message = 'Please login.'
            ctx.body = result;
            return false;
        } else {
            for (let key in post) {
                value = post[key];
                if (key !== 'username') {
                    user[key] = value;
                }
            }
            await user.save();
            result.success = true;
            result.message = 'Update profile successfully.'
            result.data = post;
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
    router.post('/register', Register);
    router.post('/login', Login);
    router.post('/logout', LogOut);
    router.post('/forgot', ForgotPassword);
    router.post('/update', UpdateProfile);
    router.get('/getToken', checkToken, GetToken);
}

