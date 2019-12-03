// const celery = require('node-celery');

const User = require('../models/User');
const Payment = require('../models/Payment');
const Stock = require('../models/Stock');
const Batch = require('../models/Batch');
const UserBatch = require('../models/UserBatch');
const UserStock = require('../models/UserStock');
// const celeryConfig = require('../../config/celery.config');

// const client = celery.createClient({
//     CELERY_BROKER_URL: celeryConfig.BROKER_URL,
//     CELERY_RESULT_BACKEND: celeryConfig.RESULT_BACKEND
// });

function sendRequestToQueue() {

}

function getStockPrice(symbol) {
    //TODO: Add url
    return 100;
    let url = '';
    request({
        url: url,
        method: 'GET',
        json: true,
        body: JSON.stringify({ symbol: symbol })
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return body.price;
        }
    });
};

const BuyStock = async (ctx) => {
    let result = {
        success: false,
        message: '',
        data: null
    };
    let post = ctx.request.body;
    let price = getStockPrice(post.symbol);
    let totalPrice = price * post.quantity;
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
        } else if (user.balance < totalPrice) {
            result.message = 'Insufficient balance, please deposit.';
            ctx.body = result;
            console.log(result);
            return false;
        } else {
            user.balance -= totalPrice;
            await user.save();
            let now = Date.now();
            let flag1 = false;
            await Batch.create({
                bought_time: now,
                quantity: post.quantity,
                symbol: post.symbol
            }, { logging: true }).then(async (batch) => {
                let batch_id = batch.dataValues.batch_id;
                let userBatchResult = await UserBatch.create({
                    username: post.username,
                    batch_id: batch_id,
                }).catch(err => {
                    ctx.body = err;
                });
                if (userBatchResult) {
                    flag1 = true;
                }
            }).catch(err => {
                ctx.body = err;
            });
            if (flag1) {
                let flag2 = false;
                await UserStock.findOne({
                    where: {
                        username: post.username,
                        symbol: post.symbol
                    }
                }).then(async (userStock) => {
                    if (!userStock) {
                        await UserStock.create({
                            username: post.username,
                            symbol: post.symbol,
                            quantity: post.quantity
                        }).catch(err => {
                            ctx.body = err;
                        });
                        flag2 = true;
                    } else {
                        userStock.quantity += post.quantity;
                        await userStock.save();
                        flag2 = true;
                    }
                }).catch(err => {
                    ctx.body = err;
                });
                if (flag2) {
                    result.success = true;
                    result.message = 'Buy stocks successfully.';
                    result.data = {
                        username: post.username,
                        symbol: post.symbol,
                        quantity: post.quantity,
                        price: price
                    };
                }
            }
        }
    }).catch(err => {
        ctx.body = err;
    });
    ctx.body = result;
};

const SellStock = async (ctx) => {
    let result = {
        success: false,
        message: '',
        data: null
    };
    let post = ctx.request.body;
    let price = getStockPrice(post.symbol);
    let totalPrice = price * post.quantity;
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
            await UserStock.findOne({
                where: {
                    username: post.username,
                    symbol: post.symbol
                }
            }).then(async (userStock) => {
                console.log(userStock);
                if (!userStock) {
                    result.message = 'User does not have this stock.';
                    ctx.body = result;
                    return result;
                } else if (userStock.quantity < post.quantity) {
                    result.message = 'Insufficient stocks.';
                    ctx.body = result;
                    return result;
                } else {
                    console.log(user.balance);
                    user.balance += totalPrice;
                    await user.save();
                    console.log(user.balance);
                    let now = Date.now();
                    let flag = false;
                    await Batch.create({
                        bought_time: now,
                        quantity: post.quantity
                    }).then(async (batch) => {
                        let batch_id = batch.dataValues.batch_id;
                        await UserBatch.create({
                            username: post.username,
                            batch_id: batch_id
                        }).catch(err => {
                            ctx.body = err;
                        });
                    }).catch(err => {
                        ctx.body = err;
                    });
                    userStock.quantity -= post.quantity;
                    await userStock.save();
                    result.success = true;
                    result.message = 'Sell stocks successfully.';
                    result.data = {
                        username: post.username,
                        symbol: post.symbol,
                        quantity: post.quantity,
                        price: price
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

const BuyStockRecurringly = async (ctx) => {

};

const SellStockRecurringly = async (ctx) => {

};

module.exports = (router) => {
    router.post('/buy', BuyStock);
    router.post('/sell', SellStock);
};
