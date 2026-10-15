const ApiError = require('../utils/ApiError');

const routeNotFound = (req, res, next) => {
    next(new ApiError(404, 'route_not_found', `${req.method} ${req.originalUrl} does not exist.`));
};

const handleErrors = (err, req, res, next) => {
    if (err instanceof ApiError) {
        const error = { code: err.code, message: err.message };
        if (err.details) error.details = err.details;
        return res.status(err.status).json({ error });
    }
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            error: { code: 'invalid_json', message: 'The request body is not valid JSON.' }
        });
    }
    console.error(err);
    res.status(500).json({
        error: { code: 'internal_error', message: 'An unexpected error occurred. Please try again later.' }
    });
};

module.exports = { routeNotFound, handleErrors };
