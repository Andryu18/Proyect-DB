const progressService = require('../services/progress.service');

const listByGame = async (req, res) => {
    res.json(await progressService.listByGame(req.data.userId, req.data.gameId));
};

const record = async (req, res) => {
    const { userId, achievementId, ...data } = req.data;
    res.json(await progressService.record(userId, achievementId, data));
};

module.exports = { listByGame, record };
