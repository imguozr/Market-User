const User = require('../models/User');
const Payment = require('../models/Payment');
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
        result.message = 'Registered successfully.';
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
                address: user.address
            };
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
            result.message = 'No such user.';
            ctx.body = result;
            return false;
        } else if (user.token === null) {
            result.message = 'Please login.';
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
            result.message = 'Update profile successfully.';
            result.data = post;
        }
    }).catch(err => {
        ctx.body = err;
    });
    ctx.body = result;
};

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
                result.message = 'Added payment successfully.';
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
        } else if (user.balance < post.balance){
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

