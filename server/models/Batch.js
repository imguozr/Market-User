const db = require('../db/db');
const Stock = require('./Stock');

module.exports = db.defineModel('batch', {
    batch_id: {
        type: db.ID_TYPE,
        primaryKey: true,
        defaultValue: db.UUIDV4
    },
    bought_time: {
        type: db.BIGINT,
        allowNull: false
    },
    quantity: db.INTEGER,
    symbol: {
        type: db.STRING(10),
        primaryKey: true,
        references: {
            model: Stock,
            key: 'symbol'
        }
    }
});
