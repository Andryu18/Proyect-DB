const achievementsService = require('../services/achievements.service');
const { sendCreated, sendNoContent } = require('../utils/responses');

const listByGame = async (req, res) => {
    res.json(await achievementsService.listByGame(req.data.gameId));
};

const create = async (req, res) => {
    const { gameId, ...data } = req.data;
    const achievement = await achievementsService.create(gameId, data);
    sendCreated(res, `/api/achievements/${achievement.id}`, achievement);
};

const get = async (req, res) => {
    res.json(await achievementsService.get(req.data.achievementId));
};

const update = async (req, res) => {
    const { achievementId, ...data } = req.data;
    res.json(await achievementsService.update(achievementId, data));
};

const remove = async (req, res) => {
    await achievementsService.remove(req.data.achievementId);
    sendNoContent(res);
};

module.exports = { listByGame, create, get, update, remove };
