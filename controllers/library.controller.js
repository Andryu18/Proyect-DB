const libraryService = require('../services/library.service');

const list = async (req, res) => {
    res.json(await libraryService.list(req.data.userId));
};

const get = async (req, res) => {
    res.json(await libraryService.get(req.data.userId, req.data.gameId));
};

const updateUsage = async (req, res) => {
    const { userId, gameId, ...usage } = req.data;
    res.json(await libraryService.updateUsage(userId, gameId, usage));
};

module.exports = { list, get, updateUsage };
