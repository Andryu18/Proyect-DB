const { validationResult, matchedData } = require('express-validator');
const { invalidData } = require('../utils/checks');

const validate = (rules) => [
    ...rules,
    (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            throw invalidData(result.array().map((e) => ({ field: e.path, message: e.msg })));
        }
        req.data = matchedData(req);
        next();
    }
];

module.exports = validate;
