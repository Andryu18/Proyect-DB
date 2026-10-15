const sendCreated = (res, location, resource) => {
    res.status(201).location(location).json(resource);
};

const sendNoContent = (res) => {
    res.status(204).end();
};

module.exports = { sendCreated, sendNoContent };
