const db = require('../utils/db')

module.exports = db.defineModel('user', {
    email: {
        type: db.STRING(50),
        unique: true
    },
    password: db.STRING(20),
    username: db.STRING(20),
    address: doNotTrack.STRING(255),
    token: {
        type: db.STRING(255),
        allowNull: true
    }
});
