const usersDao = require('../dao/users.dao');
const ApiError = require('../utils/ApiError');

const passwordMatches = (submitted, stored) => submitted === stored;

const login = async ({ username, password }) => {
    const user = await usersDao.findCredentials(username);
    if (!user || !passwordMatches(password, user.password)) {
        throw new ApiError(401, 'invalid_credentials', 'The username or the password is incorrect.');
    }
    if (user.status === 'suspended') {
        throw new ApiError(403, 'account_suspended', 'This account is suspended. Contact the administrator.');
    }
    const { password: _omitted, ...publicData } = user;
    return publicData;
};

module.exports = { login };
