const db = require('../db/db');
const User = require('./User');
const Stock = require('./Stock');

const UserStock = db.defineModel('user_stock', {
    username: {
        primaryKey: true,
        references: 'user',
        referencesKey: 'username'
    },
    symbol:{
        primaryKey: true,
        references: 'stock',
        referencesKey: 'symbol'
    },
    quantity: {
        type: db.INTEGER,
        defaultValue: 0
    }
});

UserStock.belongsTo(User, { foreignKey: 'username', targetKey: 'username' });
UserStock.belongsTo(Stock, { foreignKey: 'symbol', targetKey: 'symbol' });

module.exports = UserStock;
