const db = require('../db/db');
const User = require('./User');

module.exports = db.defineModel('user_payment', {
    payment_id: {
        type: db.ID_TYPE,
        primaryKey: true,
        defaultValue: db.UUIDV4
    },
    username: {
        type: db.STRING(20),
        primaryKey: true,
        references: {
            model: User,
            key: 'username'
        }
    },
    payment_nickname: db.STRING(50),
    account_number: db.STRING(10),
    routing_number: db.STRING(10)
});
