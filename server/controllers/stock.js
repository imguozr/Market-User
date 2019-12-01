const request = require('request');

const User = require('../models/User');
const Payment = require('../models/Payment');
const Stock = require('../models/Stock');
const Batch = require('../models/Batch');
const UserStock = require('../models/User-Stock');

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

const GetStockPrice = async (ctx) => {
    let url = '';
    let symbol = ctx.params.symbol;
    let result = {
        success: false,
        data: null
    };
    request({
        url: url,
        method: 'GET',
        json: true,
        body: JSON.stringify({ symbol: symbol })
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            result.success = true;
            result.data.symbol = symbol;
            result.data.price = body.price;
        }
    });
    ctx.body = result;
};

async function getUserBatch(username) {
    await UserStock.findAll({
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
    let batches = await getUserBatch(username);
    if (!batches) {
        for (let batch_id in batches) {
            await Batch.findOne({
                where: {
                    batch_id: batch_id
                }
            }).then(batch => {
                if (!batch) {
                    result.message = 'Wrong data.';
                    ctx.body = result;
                    return false;
                } else {
                    result.data.push({
                        symbol: batch.symbol,
                        quantity: batch.quantity,
                        bought_time: batch.bought_time
                    });
                }
            }).catch(err => {
                ctx.body = err;
            });
        }
    }
    ctx.body = result;
};

const BuyStock = async (ctx) => {

};

const SellStock = async (ctx) => {

};

const BuyStockRecurringly = async (ctx) => {

};

const SellStockRecurringly = async (ctx) => {

};

module.exports = (router) => {
    router.get('/name/:symbol', GetStockName);
    router.get('/name/all', GetAllStockNames);
    // router.get('/price/:symbol', GetStockPrice);
    // router.get('/batch/:username', GetUserBatch);
    router.get('/all/:username', GetUserStocks);
    router.post('/buy', BuyStock);
    router.post('/sell', SellStock);
};
