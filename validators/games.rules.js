const { body, query } = require('express-validator');
const { MUST_BE_NON_NEGATIVE, positiveInteger, id, reference, text } = require('./common.rules');

const AGE_RATINGS = ['E', 'E10+', 'T', 'M', 'AO', 'RP'];
const MAX_NAME_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_PRICE = 99999999.99;
const MAX_PAGE_SIZE = 100;
const TWO_DECIMALS_PATTERN = /^\d+(\.\d{1,2})?$/;

const list = [
    positiveInteger(query('genreId').optional()),
    positiveInteger(query('page').optional()),
    query('limit').optional()
        .isInt({ min: 1, max: MAX_PAGE_SIZE }).withMessage(`Must be between 1 and ${MAX_PAGE_SIZE}.`).toInt()
];

const fields = [
    text('name', MAX_NAME_LENGTH),
    body('price')
        .isFloat({ min: 0, max: MAX_PRICE }).withMessage(MUST_BE_NON_NEGATIVE).bail()
        .custom((value) => TWO_DECIMALS_PATTERN.test(String(value))).withMessage('At most two decimal places.')
        .toFloat(),
    reference('genreId', 'genre'),
    body('ageRating').isIn(AGE_RATINGS).withMessage(`Must be one of: ${AGE_RATINGS.join(', ')}.`),
    text('description', MAX_DESCRIPTION_LENGTH)
];

const byId = [id('gameId')];

const edit = [...byId, ...fields];

module.exports = { list, fields, byId, edit };
