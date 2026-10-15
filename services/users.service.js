const usersDao = require('../dao/users.dao');
const ApiError = require('../utils/ApiError');
const { requireFound } = require('../utils/checks');

const get = async (id) =>
    requireFound(await usersDao.findById(id), 'user_not_found', 'No user exists with that identifier.');

const register = async ({ username, email, password }) => {
    const existing = await usersDao.findByUsernameOrEmail(username, email);
    if (existing.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
        throw new ApiError(409, 'username_taken', 'That username is already registered. Choose another one.');
    }
    if (existing.length > 0) {
        throw new ApiError(409, 'email_taken', 'That email is already registered. Log in or use another email.');
    }
    const id = await usersDao.create({ username, email, password });
    return get(id);
};

const list = (status) => usersDao.list(status);

const changeStatus = async (id, status) => {
    await get(id);
    await usersDao.updateStatus(id, status);
    return get(id);
};

module.exports = { get, register, list, changeStatus };
