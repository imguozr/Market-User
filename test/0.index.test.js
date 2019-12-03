const
    request = require('supertest'),
    app = require('../app');

describe('Test index APIs', () => {
    let server = app.listen(9800);
    it('Test GET /test/index', async () => {
        let res = await request(server)
            .get('/test/index')
            .expect(200);
    });
});
