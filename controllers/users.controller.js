const usersService = require('../services/users.service');
const { sendCreated } = require('../utils/responses');

const register = async (req, res) => {
    const user = await usersService.register(req.data);
    sendCreated(res, `/api/users/${user.id}`, user);
};

const list = async (req, res) => {
    res.json(await usersService.list(req.data.status));
};

const get = async (req, res) => {
    res.json(await usersService.get(req.data.userId));
};

const changeStatus = async (req, res) => {
    res.json(await usersService.changeStatus(req.data.userId, req.data.status));
};

module.exports = { register, list, get, changeStatus };
