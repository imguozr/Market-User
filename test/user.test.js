const
    request = require('supertest'),
    chai = require('chai'),
    app = require('../app'),
    expect = chai.expect,
    User = require('../server/models/User');

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

    it('Test POST /user/update 0', (done) => {
        let data = {
            username: 'abc',
            email: '123@098.net',
            address: '830 N abc Rd'
        };
        request(server)
            .post('/user/update')
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

    it('Test POST /user/update 1', (done) => {
        let data = {
            username: 'abc',
            email: '123@098.net',
            address: '830 N abc Rd'
        };
        request(server)
            .post('/user/update')
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

});
