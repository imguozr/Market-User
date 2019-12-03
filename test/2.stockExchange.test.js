const
    request = require('supertest'),
    expect = require('chai').expect,
    app = require('../app'),
    User = require('../server/models/User'),
    Batch = require('../server/models/Batch'),
    UserBatch = require('../server/models/UserBatch'),
    UserStock = require('../server/models/UserStock');

describe('Test stock APIs', () => {
    let server = app.listen(10000);
    it('Test POST /stock/buy 0', (done) => {
        let data = {
            username: 'abc',
            symbol: 'APPL',
            quantity: 100
        };
        request(server)
            .post('/stock/buy')
            .send(data)
            .expect(400)
            .end((err, res) => {
                expect(res.body.success).to.be.false;
                expect(res.body.message).to.be.deep.equal('Insufficient balance, please deposit.');
                done();
            });
    });

    it('POST /balance/deposit', (done) => {
        let data = {
            username: 'abc',
            payment_nickname: 'chase',
            fund: 9950
        };
        request(server)
            .post('/user/balance/deposit')
            .send(data)
            .expect(200)
            .end((err, res) => {
                console.log(res.body);
                expect(res.body.success).to.be.true;
                expect(res.body.data.remained_balance).to.be.deep.equal(10000);
                done();
            });
    });

    it('Test POST /stock/buy 1', (done) => {
        let data = {
            username: 'abc',
            symbol: 'APPL',
            quantity: 100
        }
        request(server)
            .post('/stock/buy')
            .send(data)
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body.message).to.be.deep.equal('Buy stocks successfully.');
                done();
            });
        async () => {
            await User.findOne({
                where: {
                    username: data.username
                }
            }).then(user => {
                expect(user.balance).to.be.deep.equal(0);
            });
        };
        async() => {
            await UserStock.findOne({
                where: {
                    username: data.username
                }
            }).then(userStock => {
                expect(userStock.symbol).to.be.deep.equal('APPL');
                expect(userStock.quantity).to.be.deep.equal(100);
            });
        };
        async() => {
            await Batch.findOne({
                where: {
                    username: data.username
                }
            }).then(async (batch) => {
                expect(batch.quantity).to.be.deep.equal(100);
                expect(batch.symbol).to.be.deep.equal('APPL');
                let batch_id = batch.batch_id;
                await UserBatch.findOne({
                    where: {
                        username: data.username
                    }
                }).then(userBatch => {
                    expect(userBatch.batch_id).to.be.deep.equal(batch_id);
                })
            });
        };
    });

    // it('Test POST /stock/sell 0', (done) => {
    //     let data = {
    //         username: 'abc',
    //         symbol: 'APPL',
    //         quantity: 100
    //     }
    //     request(server)
    //         .post('/stock/sell')
    //         .send(data)
    //         .expect(200)
    //         .end((err, res) => {
    //             expect(res.body.success).to.be.true;
    //             expect(res.body.message).to.be.deep.equal('Sell stocks successfully.');
    //             done();
    //         });
    //     async () => {
    //         await User.findOne({
    //             where: {
    //                 username: data.username
    //             }
    //         }).then(user => {
    //             expect(user.balance).to.be.deep.equal(10000);
    //         });
    //     };
    //     async() => {
    //         await UserStock.findOne({
    //             where: {
    //                 username: data.username
    //             }
    //         }).then(userStock => {
    //             expect(userStock.symbol).to.be.deep.equal('APPL');
    //             expect(userStock.quantity).to.be.deep.equal(0);
    //         });
    //     };
    //     async() => {
    //         await Batch.findOne({
    //             where: {
    //                 username: data.username
    //             }
    //         }).then(async (batch) => {
    //             expect(batch.quantity).to.be.deep.equal(100);
    //             expect(batch.symbol).to.be.deep.equal('APPL');
    //             let batch_id = batch.batch_id;
    //             await UserBatch.findOne({
    //                 where: {
    //                     username: data.username
    //                 }
    //             }).then(userBatch => {
    //                 expect(userBatch.batch_id).to.be.deep.equal(batch_id);
    //             })
    //         });
    //     };
    // });
});
