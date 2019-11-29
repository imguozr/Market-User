const db = require('../utils/db');

module.exports = db.defineModel('user_payment', {
    user_id: {
        type: db.ID_TYPE,
        references: 'user',
        referencesKey: 'id'
    },
    payment_nickname: db.STRING(50),
    account_number: db.STRING(10),
    routing_number: db.STRING(10)
});
