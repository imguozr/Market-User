const request = require('request');

const User = require('../models/User');
const Payment = require('../models/Payment');
const Stock = require('../models/Stock');
const Batch = require('../models/Batch');
const UserBatch = require('../models/UserBatch');
const UserStock = require('../models/UserStock');

const GetStockName = async (ctx) => {
    let result = {
        success: false,
        name: ''
    };
    let post = ctx.request.body;
    await Stock.findOne({
        where: {
            symbol: post.symbol
        }
    }).then(stock => {
        if (!stock) {
            ctx.body = result;
            return false;
        } else {
            result.success = true;
            result.name = stock.name;
        }
    }).catch(err => {
        ctx.body = err;
    });
    ctx.body = result;
};

const GetAllStockNames = async (ctx) => {
    let result = {
        success: false,
        stocks: []
    };
    await Stock.findAll({
        attributes: ['symbol', 'name']
    }).then(stocks => {
        if (stocks.length === 0) {
            ctx.body = result;
            return false;
        } else {
            for (let stock in stocks) {
                result.stocks.push({
                    symbol: stock.symbol,
                    name: stock.name
                });
            }
        }
    }).catch(err => {
        ctx.body = err;
    });
    ctx.body = result;
};

async function getUserBatch(username) {
    await UserBatch.findAll({
        where: {
            username: username
        },
        attributes: ['batch_id']
    }).then(batches => {
        if (batches.length === 0) {
            return null;
        } else {
            return batches;
        }
    }).catch(err => {
        console.log(err);
    });
}

const GetUserStocks = async (ctx) => {
    let username = ctx.params.username;
    let result = {
        success: false,
        message: '',
        data: null
    };
    await User.findOne({
        where: {
            username: username
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
            await UserStock.findAll({
                where: {
                    username: username
                }
            }).then(userStocks => {
                if (userStocks.length === 0) {
                    result.message = 'This user has no stocks.';
                    ctx.body = result;
                    return false;
                } else {
                    result.success = true;
                    result.message = 'Fetch user\'s stocks successfully.';
                    for (let userStock in userStocks) {
                        result.data.stocks.push({
                            symbol: userStock.symbol,
                            quantity: userStock.quantity
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

module.exports = (router) => {
    router.get('/name/:symbol', GetStockName);
    router.get('/name/all', GetAllStockNames);
    // router.get('/price/:symbol', GetStockPrice);
    // router.get('/batch/:username', GetUserBatch);
    router.get('/all/:username', GetUserStocks);
};
