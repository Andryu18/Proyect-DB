const { body, param } = require('express-validator');

const MUST_BE_TEXT = 'Must be text.';
const MUST_BE_POSITIVE_INTEGER = 'Must be a positive integer.';
const MUST_BE_NON_NEGATIVE = 'Must be a number greater than or equal to zero.';
const MUST_BE_BOOLEAN = 'Must be true or false.';
const MAX_HOURS = 999999;

const positiveInteger = (chain, message = MUST_BE_POSITIVE_INTEGER) =>
    chain.isInt({ min: 1 }).withMessage(message).toInt();

const id = (name) => positiveInteger(param(name));

const reference = (field, resource) =>
    positiveInteger(body(field), `Must be the identifier of a ${resource}.`);

const string = (field) => body(field).isString().withMessage(MUST_BE_TEXT).bail();

const text = (field, max) =>
    string(field).trim().isLength({ min: 1, max }).withMessage(`Required; at most ${max} characters.`);

const hours = (chain) =>
    chain.isFloat({ min: 0, max: MAX_HOURS }).withMessage(MUST_BE_NON_NEGATIVE).toFloat();

const boolean = (field) =>
    body(field).optional().isBoolean({ strict: true }).withMessage(MUST_BE_BOOLEAN);

const optional = (field) => body(field).optional({ values: 'null' });

module.exports = {
    MUST_BE_TEXT, MUST_BE_NON_NEGATIVE, positiveInteger, id, reference, string, text, hours, boolean, optional
};
