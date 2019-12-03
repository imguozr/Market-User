const db = require('../db/db');
const User = require('./User');
const Batch = require('./Batch');

const UserBatch = db.defineModel('user_batch', {
    username: {
        primaryKey: true,
        references: 'user',
        referencesKey: 'username'
    },
    batch_id: {
        primaryKey: true,
        references: 'batch',
        referencesKey: 'batch_id'
    }
});

UserBatch.belongsTo(User, { foreignKey: 'username', targetKey: 'username' });
UserBatch.belongsTo(Batch, { foreignKey: 'batch_id', targetKey: 'batch_id' });

module.exports = UserBatch;
