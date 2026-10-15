const { body } = require('express-validator');
const { id, hours, boolean } = require('./common.rules');

const entry = [id('userId'), id('gameId')];

const usage = [
    ...entry,
    boolean('downloaded'),
    hours(body('hoursPlayed').optional()),
    body('lastPlayedAt').optional()
        .isISO8601().withMessage('Must be an ISO 8601 date and time.').toDate()
];

module.exports = { entry, usage };
