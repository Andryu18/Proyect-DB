const { body } = require('express-validator');
const { MUST_BE_TEXT, id, reference, hours, optional } = require('./common.rules');

const MIN_RATING = 1;
const MAX_RATING = 5;
const MAX_COMMENT_LENGTH = 2000;
const MAX_TAGS = 10;
const MAX_TAG_LENGTH = 30;

const fields = [
    body('rating')
        .isInt({ min: MIN_RATING, max: MAX_RATING })
        .withMessage(`Must be an integer between ${MIN_RATING} and ${MAX_RATING}.`).toInt(),
    optional('comment')
        .isString().withMessage(MUST_BE_TEXT).bail()
        .trim().isLength({ max: MAX_COMMENT_LENGTH }).withMessage(`At most ${MAX_COMMENT_LENGTH} characters.`),
    hours(optional('hoursPlayed')),
    optional('tags').isArray({ max: MAX_TAGS }).withMessage(`Must be a list of at most ${MAX_TAGS} tags.`),
    body('tags.*')
        .isString().withMessage('Each tag must be text.').bail()
        .trim().isLength({ min: 1, max: MAX_TAG_LENGTH })
        .withMessage(`Each tag must be 1 to ${MAX_TAG_LENGTH} characters.`)
];

const creation = [id('gameId'), reference('userId', 'user'), ...fields];

const byId = [id('reviewId')];

const edit = [...byId, ...fields];

module.exports = { creation, byId, edit };
