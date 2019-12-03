const db = require('../db/db');

module.exports = db.defineModel('stock', {
    symbol: {
        type: db.STRING(10),
        primaryKey: true,
        unique: true
    },
    name: {
        type: db.STRING(256),
        unique: true
    }
});
