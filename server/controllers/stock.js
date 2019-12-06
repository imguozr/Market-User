// const request = require('request');
const axios = require('axios');

const User = require('../models/User');
const Payment = require('../models/Payment');
const Stock = require('../models/Stock');
const Batch = require('../models/Batch');
const UserBatch = require('../models/UserBatch');
const UserStock = require('../models/UserStock');

const url = 'https://silvermont-stock-service.herokuapp.com';

// const GetStockName = async (ctx) => {
//     let result = {
//         success: false,
//         name: ''
//     };
//     let post = ctx.request.body;
//     await Stock.findOne({
//         where: {
//             symbol: post.symbol
//         }
//     }).then(stock => {
//         if (!stock) {
//             ctx.body = result;
//             return false;
//         } else {
//             result.success = true;
//             result.name = stock.name;
//         }
//     }).catch(err => {
//         ctx.body = err;
//     });
//     ctx.body = result;
// };

/**
 * @api {get} /stock/stock/all Get all stock names.
 * @apiName GetAllStockNames
 * @apiGroup Stock
 *
 * @apiSuccess {Boolean} success        Success or not.
 * @apiSuccess {Object[]} stocks       Stock list.
 * @apiSuccess {String} stocks.symbol   Stock symbol.
 * @apiSuccess {Integer} stocks.name    Stock name.  
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *       "success": true,
 *       "stocks": [
 *              {
 *                  "symbol": "APPL",
 *                  "name": "Apple Inc"
 *              },
 *              {
 *                  "symbol": "TECH",
 *                  "quantity": "Tech Inc"
 *              }
 *          ]
 *   }
 */
const GetAllStockNames = async (ctx) => {
    let result = {
        success: false,
        stocks: []
    };
    await Stock.findAll().then(stocks => {
        // console.log(stocks);
        if (stocks.length === 0) {
            ctx.body = result;
            return false;
        } else {
            stocks.forEach(stock => {
                result.success = true;
                result.stocks.push({
                    symbol: stock.dataValues.symbol,
                    name: stock.dataValues.name
                });
            })
            console.log(result.stocks);
        }
    }).catch(err => {
        ctx.body = err;
    });
    console.log(result);
    ctx.body = result;
};

const PostStockPrice = async (ctx) => {
    let result = null;
    let path = '/stock/v1/current-list';
    let post = ctx.request.body;
    let data = JSON.parse(post.data);
    console.log(url + path, post);
    await axios.post(url + path, {
        data: data
    }).then(function (response) {
        result = response.data;
    }).catch(function (error) {
        console.log(error);
    });
    ctx.body = result;
    console.log(ctx.body);
};

const GetStockPrice = async (ctx) => {
    let result = null;
    let path = '/stock/v1/current';
    let post = ctx.request.body;
    console.log(url + path, post);
    await axios.get(url + path, {
        params: {
            symbol: post.symbol
        }
    }).then(function (response) {
        result = response.data;
    }).catch(function (error) {
        console.log(error);
    });
    ctx.body = result;
    console.log(ctx.body);
};

const GetStockPriceIntraday = async (ctx) => {
    let result = null;
    let path = '/stock/v1/intraday';
    let post = ctx.request.body;
    console.log(url + path, post);
    await axios.get(url + path, {
        params: {
            symbol: post.symbol,
            interval: post.interval
        }
    }).then(function (response) {
        result = response.data;
    }).catch(function (error) {
        console.log(error);
    });
    ctx.body = result;
    console.log(ctx.body);
};

const GetStockPricePeriod = async (ctx) => {
    let result = null;
    let path = '/stock/v1/period';
    let post = ctx.request.body;
    console.log(url + path, post);
    await axios.get(url + path, {
        params: {
            symbol: post.symbol,
            date_from: post.date_from,
            date_to: post.date_to
        }
    }).then(function (response) {
        result = response.data;
    }).catch(function (error) {
        console.log(error);
    });
    ctx.body = result;
    console.log(ctx.body);
};

const GetStockPriceCurrWeek = async (ctx) => {
    let result = null;
    let path = '/stock/v1/current-week';
    let post = ctx.request.body;
    console.log(url + path, post);
    await axios.get(url + path, {
        params: {
            symbol: post.symbol,
            interval: post.interval
        }
    }).then(function (response) {
        result = response.data;
    }).catch(function (error) {
        console.log(error);
    });
    ctx.body = result;
    console.log(ctx.body);
};

const GetStockPricePastWeek = async (ctx) => {
    let result = null;
    let path = '/stock/v1/past-week';
    let post = ctx.request.body;
    console.log(url + path, post);
    await axios.get(url + path, {
        params: {
            symbol: post.symbol,
            interval: post.interval
        }
    }).then(function (response) {
        result = response.data;
    }).catch(function (error) {
        console.log(error);
    });
    ctx.body = result;
    console.log(ctx.body);
};

const GetStockPriceMonthToDay = async (ctx) => {
    let result = null;
    let path = '/stock/v1/month-to-date';
    let post = ctx.request.body;
    console.log(url + path, post);
    await axios.get(url + path, {
        params: {
            symbol: post.symbol
        }
    }).then(function (response) {
        result = response.data;
    }).catch(function (error) {
        console.log(error);
    });
    ctx.body = result;
    console.log(ctx.body);
};

const GetStockPriceYearToDay = async (ctx) => {
    let result = null;
    let path = '/stock/v1/year-to-date';
    let post = ctx.request.body;
    console.log(url + path, post);
    await axios.get(url + path, {
        params: {
            symbol: post.symbol
        }
    }).then(function (response) {
        result = response.data;
    }).catch(function (error) {
        console.log(error);
    });
    ctx.body = result;
    console.log(ctx.body);
};

const GetStockPricePast5Years = async (ctx) => {
    let result = null;
    let path = '/stock/v1/past-5-years';
    let post = ctx.request.body;
    console.log(url + path, post);
    await axios.get(url + path, {
        params: {
            symbol: post.symbol
        }
    }).then(function (response) {
        result = response.data;
    }).catch(function (error) {
        console.log(error);
    });
    ctx.body = result;
    console.log(ctx.body);
};

// async function getUserBatch(username) {
//     await UserBatch.findAll({
//         where: {
//             username: username
//         },
//         attributes: ['batch_id']
//     }).then(batches => {
//         if (batches.length === 0) {
//             return null;
//         } else {
//             return batches;
//         }
//     }).catch(err => {
//         console.log(err);
//     });
// }

/**
 * @api {get} /stock/user/all Get user's all stocks.
 * @apiName GetUserStocks
 * @apiGroup Stock
 *
 * @apiParam {String} username  Username.
 * @apiParamExample {json} Request-Example:
 *   {
 *       "username": "abc"
 *   }
 *
 * @apiSuccess {Boolean} success        Success or not.
 * @apiSuccess {String} message         Message.
 * @apiSuccess {Object[]} stocks  User's all stocks.
 * @apiSuccess {String} stocks.symbol  Stock symbol.
 * @apiSuccess {Integer} stocks.quantity   Stock quantity.  
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *       "success": true,
 *       "message": "Fetch user's stocks successfully.",
 *       "data": {
 *          "stocks": [
 *              {
 *                  "symbol": "APPL",
 *                  "quantity": 50
 *              },
 *              {
 *                  "symbol": "TECH",
 *                  "quantity": 80
 *              }
 *          ]
 *       }
 *   }
 */
const GetUserStocks = async (ctx) => {
    let username = ctx.request.query.username;
    let result = {
        success: false,
        message: '',
        stocks: null
    };
    console.log(username);
    await User.findOne({
        where: {
            username: username
        }
    }).then(async (user) => {
        console.log(user);
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
                console.log(userStocks);
                if (userStocks.length === 0) {
                    result.message = 'This user has no stocks.';
                    ctx.body = result;
                    return false;
                } else {
                    result.success = true;
                    result.message = 'Fetch user\'s stocks successfully.';
                    userStocks.forEach(userStock => {
                        console.log(userStock);
                        result.stocks.push({
                            symbol: userStock.dataValues.symbol,
                            quantity: userStock.dataValues.quantity
                        });
                    });
                }
            }).catch(err => {
                ctx.body = err;
            });
        }
    }).catch(err => {
        ctx.body = err;
    });
    console.log(result);
    ctx.body = result;
};

module.exports = (router) => {
    // router.get('/name/:symbol', GetStockName);
    router.get('/name/all', GetAllStockNames);
    router.get('/user/all', GetUserStocks);
    router.post('/v1/current-list', PostStockPrice);
    router.get('/v1/current', GetStockPrice);
    router.get('/v1/intraday', GetStockPriceIntraday);
    router.get('/v1/period', GetStockPricePeriod);
    router.get('/v1/current-week', GetStockPriceCurrWeek);
    router.get('/v1/past-week', GetStockPricePastWeek);
    router.get('/v1/month-to-date', GetStockPriceMonthToDay);
    router.get('/v1/year-to-date', GetStockPriceYearToDay);
    router.get('/v1/past-5-years', GetStockPricePast5Years);
};
