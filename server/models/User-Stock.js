const db = require('../db/db');
const User = require('./User');
const Batch = require('./Batch');

const UserStock = db.defineModel('user_stock', {
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

UserStock.belongsTo(User, { foreignKey: 'username', targetKey: 'username' });
UserStock.belongsTo(Batch, { foreignKey: 'batch_id', targetKey: 'batch_id' })

module.exports = UserStock;
