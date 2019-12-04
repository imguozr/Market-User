const bull = require('bull');
const redisConfig = require('../../config/redis.config');

const User = require('../models/User');
const Batch = require('../models/Batch');
const UserBatch = require('../models/UserBatch');
const UserStock = require('../models/UserStock');

const buyQueue = new bull('buy queue', { redis: { host: redisConfig.HOST, port: redisConfig.PORT } })
const sellQueue = new bull('sell queue', { redis: { host: redisConfig.HOST, port: redisConfig.PORT } })

const Buy = async (ctx) => {
    result = {
        success: false,
        message: ''
    };
    buyQueue.add({
        username: ctx.request.body.username,
        symbol: ctx.request.body.symbol,
        quantity: ctx.request.body.quantity,
        add_time: Date.now()
    }, { lifo: true }).then(job => {
        result.data.jobID = job.id;
        result.success = true;
        result.message = 'Your purchase has been placed.'
        console.log('Add buy job to queue.');
    });
    ctx.body = result;
};

const Sell = async (ctx) => {
    result = {
        success: false,
        message: ''
    };
    sellQueue.add({
        username: ctx.request.body.username,
        symbol: ctx.request.body.symbol,
        quantity: ctx.request.body.quantity,
        add_time: Date.now()
    }, { lifo: true }).then(job => {
        result.data.jobID = job.id;
        result.success = true;
        result.message = 'Your selling has been placed.'
        console.log('Add sell job to queue.');
    });
    ctx.body = result;
};

const BuyRecur = async (ctx) => {
    result = {
        success: false,
        message: '',
        data: null
    };
    let recur = ctx.request.body.recur;
    buyQueue.add({
        username: ctx.request.body.username,
        symbol: ctx.request.body.symbol,
        quantity: ctx.request.body.quantity,
        add_time: Date.now()
    }, {
        repeat: {
            every: recur.every,
            limit: recur.limit
        }
    }).then(job => {
        result.data.jobID = job.id;
        result.success = true;
        result.message = 'Your purchase has been placed.'
        console.log('Add buy job to queue.');
    });
    ctx.body = result;
};

const SellRecur = async (ctx) => {
    result = {
        success: false,
        message: '',
        data: null
    };
    let recur = ctx.request.body.recur;
    sellQueue.add({
        username: ctx.request.body.username,
        symbol: ctx.request.body.symbol,
        quantity: ctx.request.body.quantity,
        add_time: Date.now()
    }, {
        repeat: {
            every: recur.every,
            limit: recur.limit
        }
    }).then(job => {
        result.data.jobID = job.id;
        result.success = true;
        result.message = 'Your selling has been placed.'
        console.log('Add sell job to queue.');
    });
    ctx.body = result;
};

const UpdateSchedule = async (ctx) => {
    result = {
        success: false,
        message: ''
    };
    let newRecur = ctx.request.body.recur;
    let jobID = ctx.request.body.jobID;
    let behavior = ctx.request.body.behavior;
    let job = null;
    if (behavior === 'buy') {
        job = buyQueue.getJob(jobID);
    } else if (behavior === 'sell') {
        job = sellQueue.getJob(jobID);
    } else {
        result.message = 'Wrong behavior!';
        ctx.body = result;
        return result;
    }
    job.update({
        username: ctx.request.body.username,
        symbol: ctx.request.body.symbol,
        quantity: ctx.request.body.quantity,
        add_time: Date.now()
    }, {
        repeat: {
            every: newRecur.every,
            limit: newRecur.limit
        }
    });
    result.success = true;
    result.message = 'Update schedule successfully.';
    ctx.body = result;
};

const CancelSchedule = async (ctx) => {
    result = {
        success: false,
        message: ''
    };
    let jobID = ctx.request.body.jobID;
    let behavior = ctx.request.body.behavior;
    let job = null;
    if (behavior === 'buy') {
        job = buyQueue.getJob(jobID);
    } else if (behavior === 'sell') {
        job = sellQueue.getJob(jobID);
    } else {
        result.message = 'Wrong behavior!';
        ctx.body = result;
        return result;
    }
    job.remove();
    result.success = true;
    result.message = 'Cancel schedule successfully.';
    ctx.body = result;
};

buyQueue.process(async (job) => {
    post = {
        username: job.username,
        symbol: job.symbol,
        quantity: job.quantity,
        add_time: job.add_time
    }
    result = buyStock(post)
    console.log(result);
    return result;
});

sellQueue.process(async (job) => {
    post = {
        username: job.username,
        symbol: job.symbol,
        quantity: job.quantity,
        add_time: job.add_time
    }
    retsult = sellStock(post);
    console.log(result);
    return result;
});

function getStockPrice(symbol) {
    //TODO: Add url
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

async function buyStock(post) {
    let result = {
        success: false,
        message: '',
        data: null
    };
    let price = getStockPrice(post.symbol);
    let totalPrice = price * post.quantity;
    await User.findOne({
        where: {
            username: post.username
        }
    }).then(async (user) => {
        if (!user) {
            result.message = 'No such user.';
            console.log(result);
            return result;
        } else if (user.token === null) {
            result.message = 'Please Login.';
            console.log(result);
            return result;
        } else if (user.balance < totalPrice) {
            result.message = 'Insufficient balance, please deposit.';
            console.log(result);
            return result;
        } else {
            user.balance -= totalPrice;
            await user.save();
            let flag1 = false;
            await Batch.create({
                bought_time: post.add_time,
                quantity: post.quantity,
                symbol: post.symbol
            }).then(async (batch) => {
                let batch_id = batch.dataValues.batch_id;
                let userBatchResult = await UserBatch.create({
                    username: post.username,
                    batch_id: batch_id,
                }).catch(err => {
                    return err;
                });
                if (userBatchResult) {
                    flag1 = true;
                }
            }).catch(err => {
                return err;
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
                            return err;
                        });
                        flag2 = true;
                    } else {
                        userStock.quantity += post.quantity;
                        await userStock.save();
                        flag2 = true;
                    }
                }).catch(err => {
                    return err;
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
        return err;
    });
    return result;
};

async function sellStock(post) {
    let result = {
        success: false,
        message: '',
        data: null
    };
    let price = getStockPrice(post.symbol);
    let totalPrice = price * post.quantity;
    await User.findOne({
        where: {
            username: post.username
        }
    }).then(async (user) => {
        if (!user) {
            result.message = 'No such user.';
            console.log(result);
            return result;
        } else if (user.token === null) {
            result.message = 'Please Login.';
            console.log(result);
            return result;
        } else {
            await UserStock.findOne({
                where: {
                    username: post.username,
                    symbol: post.symbol
                }
            }).then(async (userStock) => {
                if (!userStock) {
                    result.message = 'User does not have this stock.';
                    console.log(result);
                    return result;
                } else if (userStock.quantity < post.quantity) {
                    result.message = 'Insufficient stocks.';
                    console.log(result);
                    return result;
                } else {
                    user.balance += totalPrice;
                    await user.save();
                    let flag = false;
                    await Batch.create({
                        bought_time: post.add_time,
                        quantity: post.quantity
                    }).then(async (batch) => {
                        let batch_id = batch.dataValues.batch_id;
                        await UserBatch.create({
                            username: post.username,
                            batch_id: batch_id
                        }).catch(err => {
                            return err;
                        });
                    }).catch(err => {
                        return err;
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
                return err;
            });
        }
    }).catch(err => {
        return err;
    });
    return ctx.body;
};

module.exports = (router) => {
    router.post('/buy/one', Buy);
    router.post('/sell/one', Sell);
    router.post('/buy/recur', BuyRecur);
    router.post('/sell/recur', SellRecur);
    router.post('/schedule/update', UpdateSchedule);
    router.post('/schedule/cancel', CancelSchedule);
};
