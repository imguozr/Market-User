const db = require('../utils/db');

module.exports = db.defineModel('user_payment', {
    user_id: {
        type: db.ID_TYPE,
        references: 'user',
        referencesKey: 'id'
    },
    payment_type: db.STRING(10),
    payment_nickname: db.STRING(256)
});
