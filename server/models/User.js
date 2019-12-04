const db = require('../db/db')

module.exports = db.defineModel('user', {
    username: {
        type: db.STRING(20),
        unique: true,
        primaryKey: true
    },
    password: db.STRING(20),
    email: {
        type: db.STRING(50),
        unique: true
    },
    address: db.STRING(255),
    balance: {
        type: db.INTEGER,
        defaultValue: 0
    },
    token: {
        type: db.STRING(255),
        allowNull: true
    }
});
