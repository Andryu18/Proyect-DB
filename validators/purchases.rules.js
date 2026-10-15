const { query } = require('express-validator');
const { id, reference } = require('./common.rules');

const purchase = [id('userId'), reference('gameId', 'game')];

const dailySales = [
    query('date').optional()
        .isDate({ format: 'YYYY-MM-DD', strictMode: true })
        .withMessage('Must be a date in YYYY-MM-DD format.')
];

module.exports = { purchase, dailySales };
