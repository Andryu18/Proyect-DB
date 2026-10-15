const { body, query } = require('express-validator');
const { id, string, text } = require('./common.rules');

const USER_STATUSES = ['active', 'suspended'];
const USERNAME_PATTERN = /^[A-Za-z0-9_.-]{3,30}$/;
const MAX_USERNAME_LENGTH = 30;
const MAX_EMAIL_LENGTH = 254;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72;

const statusIn = (chain) => chain.isIn(USER_STATUSES).withMessage('Must be active or suspended.');

const login = [
    text('username', MAX_USERNAME_LENGTH),
    string('password').notEmpty().withMessage('Required.')
];

const registration = [
    string('username').trim()
        .matches(USERNAME_PATTERN)
        .withMessage('Must be 3 to 30 characters: letters, digits, dot, hyphen or underscore.'),
    string('email').trim()
        .isEmail().withMessage('Must be a valid email address.')
        .isLength({ max: MAX_EMAIL_LENGTH }).withMessage(`At most ${MAX_EMAIL_LENGTH} characters.`),
    string('password')
        .isLength({ min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH })
        .withMessage(`Must be ${MIN_PASSWORD_LENGTH} to ${MAX_PASSWORD_LENGTH} characters.`)
];

const list = [statusIn(query('status').optional())];

const statusChange = [id('userId'), statusIn(body('status'))];

const byId = [id('userId')];

module.exports = { login, registration, list, statusChange, byId };
