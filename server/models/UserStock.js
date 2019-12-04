const db = require('../db/db');
const User = require('./User');
const Stock = require('./Stock');

module.exports = db.defineModel('user_stock', {
    username: {
        primaryKey: true,
        type: db.STRING(20),
        references: {
            model: User,
            key: 'username'
        }
    },
    symbol: {
        primaryKey: true,
        type: db.STRING(10),
        references: {
            model: Stock,
            key: 'symbol'
        }
    },
    quantity: {
        type: db.INTEGER,
        defaultValue: 0
    }
});
