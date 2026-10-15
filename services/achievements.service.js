const achievementsDao = require('../dao/achievements.dao');
const progressDao = require('../dao/progress.dao');
const gamesService = require('./games.service');
const ApiError = require('../utils/ApiError');
const { requireFound, requireNameIsFree } = require('../utils/checks');

const PROGRESS_TYPE = 'progress';

const get = async (id) =>
    requireFound(await achievementsDao.findById(id),
        'achievement_not_found', 'No achievement exists with that identifier.');

const listByGame = async (gameId) => {
    await gamesService.get(gameId);
    return achievementsDao.listByGame(gameId);
};

const ensureNameIsFree = async (gameId, name, ownId) =>
    requireNameIsFree(await achievementsDao.findByName(gameId, name), ownId,
        'achievement_exists', 'That game already has an achievement with that name.');

const toFields = ({ name, description, type, target }) => ({
    name, description, type, target: type === PROGRESS_TYPE ? target : null
});

const create = async (gameId, data) => {
    await gamesService.get(gameId);
    await ensureNameIsFree(gameId, data.name);
    const id = await achievementsDao.create({ gameId, ...toFields(data) });
    return get(id);
};

const update = async (id, data) => {
    const achievement = await get(id);
    await ensureNameIsFree(achievement.gameId, data.name, id);
    await achievementsDao.update(id, toFields(data));
    return get(id);
};

const remove = async (id) => {
    await get(id);
    if (await progressDao.countByAchievement(id) > 0) {
        throw new ApiError(409, 'achievement_has_progress',
            'Some users have progress on this achievement; deleting it would erase that progress.');
    }
    await achievementsDao.remove(id);
};

module.exports = { PROGRESS_TYPE, get, listByGame, create, update, remove };
