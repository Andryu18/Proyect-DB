const gamesService = require('../services/games.service');
const { sendCreated } = require('../utils/responses');

const list = async (req, res) => {
    res.json(await gamesService.list(req.data));
};

const get = async (req, res) => {
    res.json(await gamesService.get(req.data.gameId));
};

const create = async (req, res) => {
    const game = await gamesService.create(req.data);
    sendCreated(res, `/api/games/${game.id}`, game);
};

const update = async (req, res) => {
    const { gameId, ...data } = req.data;
    res.json(await gamesService.update(gameId, data));
};

module.exports = { list, get, create, update };
