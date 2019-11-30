const
    request = require('supertest'),
    chai = require('chai'),
    app = require('../app'),
    expect = chai.expect;

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
});
