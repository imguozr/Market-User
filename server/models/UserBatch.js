const db = require('../db/db');
const User = require('./User');
const Batch = require('./Batch');

module.exports = db.defineModel('user_batch', {
    username: {
        primaryKey: true,
        type: db.STRING(20),
        references: {
            model: User,
            key: 'username'
        }
    },
    batch_id: {
        primaryKey: true,
        type: db.ID_TYPE,
        references: {
            model: Batch,
            key: 'batch_id'
        }
    }
});
