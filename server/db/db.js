const Sequelize = require('sequelize');
const dbConfig = require('../../config/database.config');

console.log('Init sequelize...');

var sequelize = new Sequelize(dbConfig.DATABASE, dbConfig.USERNAME, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    logQueryParameters: true
});

function defineModel(name, attributes) {
    var attrs = {};
    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        underscored: true,
    });
}

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];

var exp = {
    defineModel: defineModel,
    sync: () => {
        // only allow create ddl in non-production environment:
        if (process.env.NODE_ENV !== 'production') {
            sequelize.sync({ force: true }).then(() => {
                console.log('sync done,db inited');
                process.exit(0);
            }).catch((e) => {
                console.log(`failed:${e}`);
                process.exit(0);
            });
        } else {
            throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    }
};

for (let type of TYPES) {
    exp[type] = Sequelize[type];
}

exp.ID_TYPE = Sequelize.UUID;
exp.UUIDV4 = Sequelize.UUIDV4;

module.exports = exp;
