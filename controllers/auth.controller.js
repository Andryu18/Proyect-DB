const authService = require('../services/auth.service');

const login = async (req, res) => {
    const user = await authService.login(req.data);
    res.json({ message: 'Valid credentials.', user });
};

module.exports = { login };
