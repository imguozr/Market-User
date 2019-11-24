const jwt = require('jsonwebtoken');

module.exports = (ctx, next) => {
    if (ctx.request.headers['authorization']) {
        let token = ctx.request.headers['authorization'].split(' ')[1];
        let decoded = jwt.decode(token);

        if (token && decoded.exp <= Date.now() / 1000) {
            ctx.response.status = 401;
            ctx.token = {
                success: false,
                token: false,
                message: 'Token expired, please re-log in'
            };
        } else {
            ctx.token = {
                success: true,
                token: true
            };
        }
    }
    next();
};
