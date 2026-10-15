const genresDao = require('../dao/genres.dao');
const ApiError = require('../utils/ApiError');
const { requireFound, requireNameIsFree } = require('../utils/checks');

const list = () => genresDao.list();

const get = async (id) =>
    requireFound(await genresDao.findById(id), 'genre_not_found', 'No genre exists with that identifier.');

const ensureNameIsFree = async (name, ownId) =>
    requireNameIsFree(await genresDao.findByName(name), ownId,
        'genre_exists', 'A genre with that name already exists.');

const create = async (name) => {
    await ensureNameIsFree(name);
    const id = await genresDao.create(name);
    return get(id);
};

const update = async (id, name) => {
    await get(id);
    await ensureNameIsFree(name, id);
    await genresDao.update(id, name);
    return get(id);
};

const remove = async (id) => {
    await get(id);
    if (await genresDao.countGames(id) > 0) {
        throw new ApiError(409, 'genre_in_use',
            'The genre has games assigned. Reassign those games before deleting it.');
    }
    await genresDao.remove(id);
};

module.exports = { list, get, create, update, remove };
