const
    request = require('supertest'),
    expect = require('chai').expect,
    app = require('../app'),
    User = require('../server/models/User'),
    Payment = require('../server/models/Payment');

describe('Testing user APIs', () => {
    let server = app.listen(9900);
    it('Test POST /user/register 0', (done) => {
        let data = {
            username: 'abc',
            password: '123qer235246',
            email: '123@345.com',
            address: '10 W asdf dr'
        };
        request(server)
            .post('/user/register')
            .send(data)
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body.data).to.deep.equal({
                    username: 'abc',
                    email: '123@345.com'
                });
                done();
            });
    });

    it('Test POST /user/register 1', (done) => {
        let data = {
            username: 'abc',
            password: '123qer235246asd',
            email: '123@345.com',
            address: '10 W asdf dr'
        };
        request(server)
            .post('/user/register')
            .send(data)
            .expect(400)
            .end((err, res) => {
                expect(res.body.success).to.be.false;
                expect(res.body.message).to.deep.equal('Registered before!');
                done();
            });
    });

    it('Test POST /user/login 0', (done) => {
        let data = {
            username: 'abc',
            password: '123qer235246'
        };
        request(server)
            .post('/user/login')
            .send(data)
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body.data.username).to.deep.equal('abc');
                done();
            });
    });

    it('Test POST /user/login 1', (done) => {
        let data = {
            username: 'abc',
            password: '123235246'
        };
        request(server)
            .post('/user/login')
            .send(data)
            .expect(400)
            .end((err, res) => {
                expect(res.body.success).to.be.false;
                expect(res.body.message).to.deep.equal('Wrong Password.');
                done();
            });
    });

    it('Test POST /user/login 2', (done) => {
        let data = {
            username: 'abcde',
            password: '123qer235246'
        };
        request(server)
            .post('/user/login')
            .send(data)
            .expect(400)
            .end((err, res) => {
                expect(res.body.success).to.be.false;
                expect(res.body.message).to.deep.equal('No such user.');
                done();
            });
    });

    it('Test POST /user/logout 0', (done) => {
        let data = {
            username: 'abc'
        };
        request(server)
            .post('/user/logout')
            .send(data)
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body.message).to.deep.equal('Logged out successfully.');
                done();
            });
        async () => {
            await User.findOne({
                where: {
                    username: data.username
                }
            }).then(user => {
                expect(user.token).to.be.null;
            });
        };
    });

    it('Test POST /user/logout 1', (done) => {
        let data = {
            username: 'abcdeagfg'
        };
        request(server)
            .post('/user/logout')
            .send(data)
            .expect(400)
            .end((err, res) => {
                expect(res.body.success).to.be.false;
                expect(res.body.message).to.deep.equal('No such user or have logged out already.');
                done();
            });
    });

    it('Test POST /user/forgot 0', (done) => {
        let data = {
            username: 'abcd',
            oldPassword: '123qer235246',
            newPassword: '1qadfwrg43'
        };
        request(server)
            .post('/user/forgot')
            .send(data)
            .expect(400)
            .end((err, res) => {
                expect(res.body.success).to.be.false;
                expect(res.body.message).to.deep.equal('No such user.');
                done();
            });
    });

    it('POST /user/login', (done) => {
        let data = {
            username: 'abc',
            password: '123qer235246'
        };
        request(server)
            .post('/user/login')
            .send(data)
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body.data.username).to.deep.equal('abc');
                done();
            });
    });

    it('Test POST /user/forgot 1', (done) => {
        let data = {
            username: 'abc',
            oldPassword: '123235246',
            newPassword: '1qadfwrg43'
        };
        request(server)
            .post('/user/forgot')
            .send(data)
            .expect(400)
            .end((err, res) => {
                expect(res.body.success).to.be.false;
                expect(res.body.message).to.deep.equal('Wrong password.');
                done();
            });
    });

    it('Test POST /user/forgot 2', (done) => {
        let data = {
            username: 'abc',
            oldPassword: '123qer235246',
            newPassword: '1qadfwrg43'
        };
        request(server)
            .post('/user/forgot')
            .send(data)
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body.message).to.deep.equal('Reset password successfully, please re-login.');
                done();
            });
        async () => {
            await User.findOne({
                where: {
                    username: data.username
                }
            }).then(user => {
                expect(user.token).to.be.null;
                expect(user.password).to.be.deep.equal(data.newPassword);
            });
        };
    });

    it('Test POST /user/forgot 3', (done) => {
        let data = {
            username: 'abc',
            oldPassword: '123qer235246',
            newPassword: '1qadfwrg43'
        };
        request(server)
            .post('/user/forgot')
            .send(data)
            .expect(400)
            .end((err, res) => {
                expect(res.body.success).to.be.false;
                expect(res.body.message).to.deep.equal('Please login.');
                done();
            });
    });

    it('Test POST /user/profile/update 0', (done) => {
        let data = {
            username: 'abc',
            email: '123@098.net',
            address: '830 N abc Rd'
        };
        request(server)
            .post('/user/profile/update')
            .send(data)
            .expect(400)
            .end((err, res) => {
                expect(res.body.success).to.be.false;
                expect(res.body.message).to.deep.equal('Please login.');
                done();
            });
    });

    it('POST /user/login', (done) => {
        let data = {
            username: 'abc',
            password: '1qadfwrg43'
        };
        request(server)
            .post('/user/login')
            .send(data)
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body.data.username).to.deep.equal('abc');
                done();
            });
    });

    it('Test POST /user/profile/update 1', (done) => {
        let data = {
            username: 'abc',
            email: '123@098.net',
            address: '830 N abc Rd'
        };
        request(server)
            .post('/user/profile/update')
            .send(data)
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body.message).to.deep.equal('Update profile successfully.');
                expect(res.body.data).to.be.deep.equal(data);
                done();
            });
        async () => {
            await User.findOne({
                where: {
                    username: data.username
                }
            }).then(user => {
                expect(user.email).to.be.deep.equal(data.email);
                expect(user.address).to.be.deep.equal(data.address);
            });
        };
    });

    it('Test GET /user/profile 0', (done) => {
        let data = {
            username: 'abc'
        };
        request(server)
            .get('/user/profile')
            .send(data)
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body.message).to.be.deep.equal('Fetch profile successfully.');
                done();
            });
        async () => {
            await User.findOne({
                where: {
                    username: post.username
                }
            }).then(user => {
                expect(res.body.data).to.be.deep.equal({
                    username: user.username,
                    email: user.email,
                    address: user.address
                })
            });
        };
    });

    it('Test GET /user/profile 1', (done) => {
        let data = {
            username: 'abcd'
        };
        request(server)
            .get('/user/profile')
            .send(data)
            .expect(400)
            .end((err, res) => {
                expect(res.body.success).to.be.false;
                expect(res.body.message).to.be.deep.equal('No such user.');
                done();
            });
    });

    it('POST /user/logout', (done) => {
        let data = {
            username: 'abc'
        };
        request(server)
            .post('/user/logout')
            .send(data)
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body.message).to.deep.equal('Logged out successfully.');
                done();
            });
    });

    it('Test GET /user/profile 2', (done) => {
        let data = {
            username: 'abc'
        };
        request(server)
            .get('/user/profile')
            .send(data)
            .expect(400)
            .end((err, res) => {
                expect(res.body.success).to.be.false;
                expect(res.body.message).to.be.deep.equal('Please login.');
                done();
            });
    });

    it('Test POST /payment 0', (done) => {
        let data = {
            username: 'abc'
        };
        request(server)
            .get('/user/payment')
            .send(data)
            .expect(400)
            .end((err, res) => {
                expect(res.body.success).to.be.false;
                expect(res.body.message).to.be.deep.equal('Please login.');
                done();
            });
    });

    it('POST /user/login', (done) => {
        let data = {
            username: 'abc',
            password: '1qadfwrg43'
        };
        request(server)
            .post('/user/login')
            .send(data)
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body.data.username).to.deep.equal('abc');
                done();
            });
    });

    it('Test POST /user/payment 1', (done) => {
        let data = {
            username: 'abc'
        };
        request(server)
            .get('/user/payment')
            .send(data)
            .expect(400)
            .end((err, res) => {
                expect(res.body.success).to.be.false;
                expect(res.body.message).to.be.deep.equal('No payments yet, please add one.');
                done();
            });
    });

    it('Test POST /payment/add 0', (done) => {
        let data = {
            username: 'abc',
            payment_nickname: 'chase',
            account_number: '1234567890',
            routing_number: '1111111111'
        };
        request(server)
            .post('/user/payment/add')
            .send(data)
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body.message).to.be.deep.equal('Added payment successfully.');
                done();
            });
        async () => {
            await Payment.findOne({
                where: {
                    username: data.username
                }
            }).then(payment => {
                expect(res.body.data).to.be.deep.equal({
                    username: payment.username,
                    payment_nickname: payment.payment_nickname,
                    account_number: payment.account_number,
                    routing_number: payment.routing_number
                });
                done();
            });
        };
    });

    it('Test POST /user/payment 2', (done) => {
        let data = {
            username: 'abc'
        };
        request(server)
            .get('/user/payment')
            .send(data)
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body.message).to.be.deep.equal('Fetch payments successfully.');
                done();
            });
        async () => {
            await Payment.findAll({
                where: {
                    username: data.username
                }
            }).then(payments => {
                tmp = arr[0];
                for (let payment in payments) {
                    tmp.push({
                        payment_nickname: payment.payment_nickname,
                        account_number: payment.account_number,
                        routing_number: payment.routing_number
                    });
                }
                expect(res.body.data).to.be.deep.equal(tmp);
            });
        };
    });

    it('Test POST /user/payment/update 0', (done) => {
        let data = {
            username: 'abc',
            payment_nickname: 'chase',
            routing_number: '0987654321',
            account_number: '2222222222'
        };
        request(server)
            .post('/user/payment/update')
            .send(data)
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body.message).to.be.deep.equal('Update payment successfully.');
                done();
            });
        async () => {
            await Payment.findOne({
                where: {
                    username: data.username,
                    payment_nickname: data.payment_nickname
                }
            }).then(payment => {
                expect(res.body.data).to.be.deep.equal({
                    username: payment.username,
                    payment_nickname: payment.payment_nickname,
                    routing_number: payment.routing_number,
                    account_number: payment.account_number
                });
            });
        };
    });

    it('Test POST /balance/deposit 0', (done) => {
        let data = {
            username: 'abc',
            payment_nickname: 'chase',
            fund: 100
        };
        request(server)
            .post('/user/balance/deposit')
            .send(data)
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body.message).to.be.equal('Deposit successfully.');
                expect(res.body.data).to.be.deep.equal({
                    username: 'abc',
                    remained_balance: 100
                });
                done();
            });
    });

    it('Test POST /balance/cashout 0', (done) => {
        let data = {
            username: 'abc',
            payment_nickname: 'chase',
            fund: 50
        };
        request(server)
            .post('/user/balance/cashout')
            .send(data)
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body.message).to.be.equal('Cashed out successfully.');
                expect(res.body.data).to.be.deep.equal({
                    username: 'abc',
                    remained_balance: 50
                });
                done();
            });
    });

});
