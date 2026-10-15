const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../env/mysqlConfig');

const read = (file) => fs.readFileSync(path.join(__dirname, '..', 'db', file), 'utf8');

(async () => {
    const { database, ...serverConfig } = config;
    const cx = await mysql.createConnection({ ...serverConfig, multipleStatements: true });
    try {
        await cx.query(read('schema.sql'));
        console.log('Schema created.');
        await cx.query(read('seed.sql'));
        console.log('Test data loaded.');
    } finally {
        await cx.end();
    }
})().catch((err) => {
    console.error('Could not initialize the database:', err.message);
    process.exit(1);
});
