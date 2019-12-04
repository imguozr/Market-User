const User = require('../models/User');
const Payment = require('../models/Payment');
const createToken = require('../middlewares/createToken');
const checkToken = require('../middlewares/checkToken');

/**
 * @api {post} /user/register User Register
 * @apiName Register
 * @apiGroup User
 *
 * @apiParam {String} username  Username.
 * @apiParam {String} password  Encrypted password.
 * @apiParam {String} email     Email.
 * @apiParam {String} address   Address.
 * @apiParamExample {json} Request-Example:
 *   {
 *       "username": "abc",
 *       "password": "124rweb4y67guaxvtc^%RF%^&7",
 *       "email": "123@4567.com",
 *       "address": "9 W asd Rd."
 *   }
 *
 * @apiSuccess {Boolean} success        Success or not.
 * @apiSuccess {String} message         Message.
 * @apiSuccess {Object} data            User information.
 * @apiSuccess {String} data.username   Username.
 * @apiSuccess {String} data.email      Email.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *       "success": true,
 *       "message": "Registered successfully.",
 *       "data": {
 *          "username": "abc",
 *          "email": "123@4567.com"
 *       }
 *   }
 */
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
        result.message = 'Registered successfully.';
        result.data = {
            username: post.username,
            email: post.email
        };
    }
    ctx.body = result;
};

/**
 * @api {post} /user/login User Login
 * @apiName Login
 * @apiGroup User
 *
 * @apiParam {String} username  Username.
 * @apiParam {String} password  Encrypted password.
 * @apiParamExample {json} Request-Example:
 *   {
 *       "username": "abc",
 *       "password": "124rweb4y67guaxvtc^%RF%^&7"
 *   }
 *
 * @apiSuccess {Boolean} success        Success or not.
 * @apiSuccess {String} message         Message.
 * @apiSuccess {Object} data            User information.
 * @apiSuccess {String} data.username   Username.
 * @apiSuccess {String} data.token      Token to judge user status.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *       "success": true,
 *       "message": "Login successfully.",
 *       "data": {
 *          "username": "abc",
 *          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWJjIiwiaWF0IjoxNTc1NDI0OTk1LCJleHAiOjE1NzU0MjUwMDV9.Ci9UcN2zvlLKoyj5as9SI_UYpbsVPqNihmzPpjHW_cs"
 *       }
 *   }
 */
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
            result.message = 'Login successfully.';
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

/**
 * @api {post} /user/logout User Logout
 * @apiName Logout
 * @apiGroup User
 *
 * @apiParam {String} username  Username.
 * @apiParamExample {json} Request-Example:
 *   {
 *       "username": "abc"
 *   }
 *
 * @apiSuccess {Boolean} success    Success or not.
 * @apiSuccess {String} message     Message.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *       "success": true,
 *       "message": "Logged out successfully."
 *   }
 */
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
            result.message = 'No such user or have logged out already.';
            ctx.body = result;
            return false;
        } else {
            user.token = null;
            await user.save();
            result.success = true;
            result.message = 'Logged out successfully.';
        }
    }).catch(err => {
        ctx.body = err;
    });
    ctx.body = result;
};

/**
 * @api {post} /user/forgot User Forgot Password
 * @apiName Forgot
 * @apiGroup User
 *
 * @apiParam {String} username  Username.
 * @apiParam {String} oldPassword  Old password.
 * @apiParam {String} newPassword  New password.
 * @apiParamExample {json} Request-Example:
 *   {
 *       "username": "abc",
 *       "oldPassword": "124r1237",
 *       "newPassword": "axf25ersdg"
 *   }
 *
 * @apiSuccess {Boolean} success        Success or not.
 * @apiSuccess {String} message         Message.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *       "success": true,
 *       "message": "Reset password successfully, please re-login."
 *   }
 */
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
            result.message = 'Reset password successfully, please re-login.';
        } else {
            result.message = 'Wrong password.';
        }
    }).catch(err => {
        ctx.body = err;
    });
    ctx.body = result;
};

/**
 * @api {get} /user/profile Get User Profile
 * @apiName GetProfile
 * @apiGroup User
 *
 * @apiParam {String} username  Username.
 * @apiParamExample {json} Request-Example:
 *   {
 *       "username": "abc"
 *   }
 *
 * @apiSuccess {Boolean} success        Success or not.
 * @apiSuccess {String} message         Message.
 * @apiSuccess {Object} data            User information.
 * @apiSuccess {String} data.username   Username.
 * @apiSuccess {String} data.email      New email.
 * @apiSuccess {String} data.address    New address.
 * @apiSuccess {Integer} data.balance   Balance.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *       "success": true,
 *       "message": "Fetch profile successfully.",
 *       "data": {
 *          "username": "abc",
 *          "email": "345@123.com",
 *          "address": "10 N iojgfs Dr.",
 *          "balance": 0
 *       }
 *   }
 */
const GetProfile = async (ctx) => {
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
        if (!user) {
            result.message = 'No such user.';
            ctx.body = result;
            return false;
        } else if (user.token === null) {
            result.message = 'Please login.';
            ctx.body = result;
            return false;
        } else {
            result.success = true;
            result.message = 'Fetch profile successfully.';
            result.data = {
                username: user.username,
                email: user.email,
                address: user.address,
                balance: user.balance
            };
        }
    }).catch(err => {
        ctx.body = err;
    });
    ctx.body = result;
};

/**
 * @api {post} /user/profile/update Update User Profile
 * @apiName UpdateProfile
 * @apiGroup User
 *
 * @apiParam {String} username  Username.
 * @apiParam {String} email     Email.
 * @apiParam {String} address   Address.
 * @apiParamExample {json} Request-Example:
 *   {
 *       "username": "abc",
 *       "email": "124@axa.net",
 *       "address": "80 W rwg Rd."
 *   }
 *
 * @apiSuccess {Boolean} success        Success or not.
 * @apiSuccess {String} message         Message.
 * @apiSuccess {Object} data            User information.
 * @apiSuccess {String} data.username   Username.
 * @apiSuccess {String} data.email      Email.
 * @apiSuccess {String} data.address    Address.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *       "success": true,
 *       "message": "Update profile successfully.",
 *       "data": {
 *          "username": "abc",
 *          "email": "124@axa.net",
 *          "address": "80 W rwg Rd."
 *       }
 *   }
 */
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
            result.message = 'No such user.';
            ctx.body = result;
            return false;
        } else if (user.token === null) {
            result.message = 'Please login.';
            ctx.body = result;
            return false;
        } else {
            user.email = post.email;
            user.address = post.address;
            await user.save();
            result.success = true;
            result.message = 'Update profile successfully.';
            result.data = post;
        }
    }).catch(err => {
        ctx.body = err;
    });
    ctx.body = result;
};

/**
 * @api {get} /user/payment Get User Payment Methods
 * @apiName GetPayment
 * @apiGroup User
 *
 * @apiParam {String} username  Username.
 * @apiParamExample {json} Request-Example:
 *   {
 *       "username": "abc"
 *   }
 *
 * @apiSuccess {Boolean} success        Success or not.
 * @apiSuccess {String} message         Message.
 * @apiSuccess {Object} data            User information.
 * @apiSuccess {String} data.username   Username.
 * @apiSuccess {String} data.payment_nickname     Payment nickname.
 * @apiSuccess {String} data.account_number     Account number.
 * @apiSuccess {String} data.routing_number     Routing number.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *       "success": true,
 *       "message": "Fetch payments successfully.",
 *       "data": {
 *          "username": "abc",
 *          "payment_nickname": "chase",
 *          "account_number": "1234567890",
 *          "routing_number": "1112223331"
 *       }
 *   }
 */
const GetPayment = async (ctx) => {
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
        } else if (user.token === null) {
            result.message = 'Please login.';
            ctx.body = result;
            return false;
        } else {
            await Payment.findAll({
                where: {
                    username: post.username
                },
                raw: true
            }).then(payments => {
                if (payments.length === 0) {
                    result.message = 'No payments yet, please add one.';
                    ctx.body = result;
                    return false;
                } else {
                    result.success = true;
                    result.message = 'Fetch payments successfully.';
                    for (let payment in payments) {
                        result.data.payments.push({
                            payment_nickname: payment.payment_nickname,
                            account_number: payment.account_number,
                            routing_number: payment.routing_number
                        });
                    }
                }
            }).catch(err => {
                ctx.body = err;
            });
        }
    }).catch(err => {
        ctx.body = err;
    });
    ctx.body = result;
};

/**
 * @api {post} /user/payment/add Add User Payment Method
 * @apiName AddPayment
 * @apiGroup User
 *
 * @apiParam {String} username          Username.
 * @apiParam {String} payment_nickname  Payment nickname.
 * @apiParam {String} account_number    Account number.
 * @apiParam {String} routing_number    Routing number.
 * @apiParamExample {json} Request-Example:
 *   {
 *       "username": "abc",
 *       "payment_nickname": "chase",
 *       "account_number": "1234567890",
 *       "routing_number": "1112223331"
 *   }
 *
 * @apiSuccess {Boolean} success        Success or not.
 * @apiSuccess {String} message         Message.
 * @apiSuccess {Object} data            User information.
 * @apiSuccess {String} data.username   Username.
 * @apiSuccess {String} data.payment_nickname     Payment nickname.
 * @apiSuccess {String} data.account_number     Account number.
 * @apiSuccess {String} data.routing_number     Routing number.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *       "success": true,
 *       "message": "Add payment successfully.",
 *       "data": {
 *          "username": "abc",
 *          "payment_nickname": "chase",
 *          "account_number": "1234567890",
 *          "routing_number": "1112223331"
 *       }
 *   }
 */
const AddPayment = async (ctx) => {
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
        } else if (user.token === null) {
            result.message = 'Please login.';
            ctx.body = result;
            return false;
        } else {
            let paymentResult = await Payment.create({
                username: post.username,
                payment_nickname: post.payment_nickname,
                account_number: post.account_number,
                routing_number: post.routing_number
            }).catch(err => {
                ctx.body = err;
            });
            if (paymentResult) {
                result.success = true;
                result.message = 'Add payment successfully.';
                result.data = {
                    username: post.username,
                    payment_nickname: post.payment_nickname,
                    account_number: post.account_number,
                    routing_number: post.routing_number
                };
            }
        }
    }).catch(err => {
        ctx.body = err;
    });
    ctx.body = result;
};

/**
 * @api {post} /user/payment/update Update User Payment Method
 * @apiName UpdatePayment
 * @apiGroup User
 *
 * @apiParam {String} username          Username.
 * @apiParam {String} payment_nickname  Payment nickname. (NOT changable)
 * @apiParam {String} account_number    Account number.
 * @apiParam {String} routing_number    Routing number.
 * @apiParamExample {json} Request-Example:
 *   {
 *       "username": "abc",
 *       "payment_nickname": "chase",
 *       "account_number": "1234567890",
 *       "routing_number": "1112344431"
 *   }
 *
 * @apiSuccess {Boolean} success        Success or not.
 * @apiSuccess {String} message         Message.
 * @apiSuccess {Object} data            User information.
 * @apiSuccess {String} data.username   Username.
 * @apiSuccess {String} data.payment_nickname     Payment nickname.
 * @apiSuccess {String} data.account_number     Account number.
 * @apiSuccess {String} data.routing_number     Routing number.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *       "success": true,
 *       "message": "Add payment successfully.",
 *       "data": {
 *          "username": "abc",
 *          "payment_nickname": "chase",
 *          "account_number": "1234567890",
 *          "routing_number": "1112344431"
 *       }
 *   }
 */
const UpdatePayment = async (ctx) => {
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
        } else if (user.token === null) {
            result.message = 'Please login.';
            ctx.body = result;
            return false;
        } else {
            await Payment.findOne({
                where: {
                    username: post.username,
                    payment_nickname: post.payment_nickname
                }
            }).then(async (payment) => {
                if (!payment) {
                    result.message = 'No such payment.';
                    ctx.body = result;
                    return false;
                } else {
                    payment.account_number = post.account_number;
                    payment.routing_number = post.routing_number;
                    await payment.save();
                    result.success = true;
                    result.message = 'Update payment successfully.';
                    result.data = post;
                }
            }).catch(err => {
                ctx.body = err;
            });
        }
    }).catch(err => {
        ctx.body = err;
    });
    ctx.body = result;
};

/**
 * @api {post} /user/balance/cashout Balance To Payment Account
 * @apiName BalanceToPayment
 * @apiGroup User
 *
 * @apiParam {String} username          Username.
 * @apiParam {String} payment_nickname  Payment nickname.
 * @apiParam {Integer} fund              Amount of money.

 * @apiParamExample {json} Request-Example:
 *   {
 *       "username": "abc",
 *       "payment_nickname": "chase",
 *       "fund": 50,
 *   }
 *
 * @apiSuccess {Boolean} success        Success or not.
 * @apiSuccess {String} message         Message.
 * @apiSuccess {Object} data            User information.
 * @apiSuccess {String} data.username   Username.
 * @apiSuccess {Integer} data.remained_balance     Remained balance.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *       "success": true,
 *       "message": "Cashed out successfully.",
 *       "data": {
 *          "username": "abc",
 *          "remained_balance": 50,
 *       }
 *   }
 */
const BalanceToPayment = async (ctx) => {
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
        } else if (user.token === null) {
            result.message = 'Please Login.';
            ctx.body = result;
            return false;
        } else if (user.balance < post.balance) {
            result.message = 'Insufficient balance.';
            ctx.body = result;
            return false;
        } else {
            await Payment.findOne({
                where: {
                    username: post.username,
                    payment_nickname: post.payment_nickname
                }
            }).then(async (payment) => {
                if (!payment) {
                    result.message = 'No such payment.';
                    ctx.body = result;
                    return false;
                } else {
                    user.balance -= post.fund;
                    await user.save();
                    result.success = true;
                    result.message = 'Cashed out successfully.';
                    result.data = {
                        username: user.username,
                        remained_balance: user.balance
                    };
                }
            }).catch(err => {
                ctx.body = err;
            });
        }
        ctx.body = result;
    }).catch(err => {
        ctx.body = err;
    });
};

/**
 * @api {post} /user/balance/deposit Payment Account To Balance
 * @apiName PaymentToBalance
 * @apiGroup User
 *
 * @apiParam {String} username          Username.
 * @apiParam {String} payment_nickname  Payment nickname.
 * @apiParam {Integer} fund              Amount of money.

 * @apiParamExample {json} Request-Example:
 *   {
 *       "username": "abc",
 *       "payment_nickname": "chase",
 *       "fund": 50,
 *   }
 *
 * @apiSuccess {Boolean} success        Success or not.
 * @apiSuccess {String} message         Message.
 * @apiSuccess {Object} data            User information.
 * @apiSuccess {String} data.username   Username.
 * @apiSuccess {Integer} data.remained_balance     Remained balance.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *       "success": true,
 *       "message": "Deposit successfully.",
 *       "data": {
 *          "username": "abc",
 *          "remained_balance": 50,
 *       }
 *   }
 */
const PaymentToBalance = async (ctx) => {
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
        } else if (user.token === null) {
            result.message = 'Please Login.';
            ctx.body = result;
            return false;
        } else {
            await Payment.findOne({
                where: {
                    username: post.username,
                    payment_nickname: post.payment_nickname
                }
            }).then(async (payment) => {
                if (!payment) {
                    result.message = 'No such payment.';
                    ctx.body = result;
                    return false;
                } else {
                    user.balance += post.fund;
                    await user.save();
                    result.success = true;
                    result.message = 'Deposit successfully.';
                    result.data = {
                        username: user.username,
                        remained_balance: user.balance
                    };
                }
            }).catch(err => {
                ctx.body = err;
            });
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
    router.get('/profile', GetProfile);
    router.post('/profile/update', UpdateProfile);
    router.get('/payment', GetPayment);
    router.post('/payment/add', AddPayment);
    router.post('/payment/update', UpdatePayment);
    router.post('/balance/cashout', BalanceToPayment);
    router.post('/balance/deposit', PaymentToBalance);
    router.get('/getToken', checkToken, GetToken);
};

