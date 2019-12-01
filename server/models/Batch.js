const db = require('../db/db');
const Stock = require('./Stock');

var Batch = db.defineModel('batch', {
    batch_id: {
        type: db.ID_TYPE,
        primaryKey: true,
        defaultValue: db.UUIDV4
    },
    bought_time: {
        type: db.BIGINT,
        allowNull: false
    },
    quantity: db.INTEGER
});

Batch.belongsTo(Stock, { foreignKey: 'symbol', targetKey: 'symbol' });

module.exports = Batch;
