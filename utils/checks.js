const ApiError = require('./ApiError');

const requireFound = (entity, code, message) => {
    if (!entity) throw new ApiError(404, code, message);
    return entity;
};

const requireNameIsFree = (existing, ownId, code, message) => {
    if (existing && existing.id !== ownId) throw new ApiError(409, code, message);
};

const invalidData = (details) =>
    new ApiError(400, 'invalid_data', 'The submitted data is not valid.', details);

module.exports = { requireFound, requireNameIsFree, invalidData };
