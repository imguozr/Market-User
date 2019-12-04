const fs = require('fs');
const csv = require('csv');

const Stock = require('../models/Stock');

const input = fs.createReadStream(__dirname + '/stocks.csv');
const parser = csv.parse({
    delimiter: ',',
    columns: true
})

const transform = csv.transform((row) => {
    let resultObj = {
        symbol: row['Symbol'],
        name: row['Name']
    }
    Stock.create(resultObj)
        .catch(function (err) {
            console.log('Error encountered: ' + err)
        });
});
input.pipe(parser).pipe(transform);

console.log('dump csv ok.');
