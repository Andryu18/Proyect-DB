const { body } = require('express-validator');
const { positiveInteger, id, text, boolean } = require('./common.rules');

const ACHIEVEMENT_TYPES = ['simple', 'progress', 'dated'];
const PROGRESS_TYPE = 'progress';
const MAX_NAME_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 255;

const fields = [
    text('name', MAX_NAME_LENGTH),
    text('description', MAX_DESCRIPTION_LENGTH),
    body('type').isIn(ACHIEVEMENT_TYPES).withMessage(`Must be one of: ${ACHIEVEMENT_TYPES.join(', ')}.`),
    positiveInteger(
        body('target').if(body('type').equals(PROGRESS_TYPE)),
        'A progress achievement requires an integer target greater than zero.'
    ),
    body('target')
        .if(body('type').not().equals(PROGRESS_TYPE))
        .custom((value) => value === undefined || value === null)
        .withMessage('Only progress achievements have a target.')
];

const creation = [id('gameId'), ...fields];

const byId = [id('achievementId')];

const edit = [...byId, ...fields];

const userProgress = [
    id('userId'),
    id('achievementId'),
    body('progress').optional()
        .isInt({ min: 0 }).withMessage('Must be an integer greater than or equal to zero.').toInt(),
    boolean('unlocked')
];

module.exports = { creation, byId, edit, userProgress };
