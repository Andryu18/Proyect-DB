const gamesDao = require('../dao/games.dao');
const genresService = require('./genres.service');
const { requireFound, requireNameIsFree } = require('../utils/checks');

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

const list = async ({ genreId, page = DEFAULT_PAGE, limit = DEFAULT_PAGE_SIZE }) => {
    const [data, total] = await Promise.all([
        gamesDao.list({ genreId, limit, offset: (page - 1) * limit }),
        gamesDao.count(genreId)
    ]);
    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const get = async (id) =>
    requireFound(await gamesDao.findById(id), 'game_not_found', 'No game exists with that identifier.');

const ensureNameIsFree = async (name, ownId) =>
    requireNameIsFree(await gamesDao.findByName(name), ownId,
        'game_exists', 'A game with that name already exists in the catalog.');

const create = async (data) => {
    await genresService.get(data.genreId);
    await ensureNameIsFree(data.name);
    const id = await gamesDao.create(data);
    return get(id);
};

const update = async (id, data) => {
    await get(id);
    await genresService.get(data.genreId);
    await ensureNameIsFree(data.name, id);
    await gamesDao.update(id, data);
    return get(id);
};

module.exports = { list, get, create, update };
