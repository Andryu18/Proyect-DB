const libraryDao = require('../dao/library.dao');
const usersService = require('./users.service');
const { requireFound, invalidData } = require('../utils/checks');

const withStatus = (entry) => ({
    ...entry,
    status: entry.downloaded ? 'downloaded' : entry.lastPlayedAt ? 'played' : 'not_played'
});

const list = async (userId) => {
    await usersService.get(userId);
    return (await libraryDao.listByUser(userId)).map(withStatus);
};

const get = async (userId, gameId) => {
    await usersService.get(userId);
    const entry = requireFound(await libraryDao.find(userId, gameId),
        'game_not_in_library', 'That game is not in the user\'s library.');
    return withStatus(entry);
};

const updateUsage = async (userId, gameId, { downloaded, hoursPlayed, lastPlayedAt }) => {
    await get(userId, gameId);
    const changes = {};
    if (downloaded !== undefined) changes.downloaded = downloaded;
    if (hoursPlayed !== undefined) changes.hours_played = hoursPlayed;
    if (lastPlayedAt !== undefined) changes.last_played_at = lastPlayedAt;
    if (Object.keys(changes).length === 0) {
        throw invalidData([{ field: 'body', message: 'Send at least one of: downloaded, hoursPlayed, lastPlayedAt.' }]);
    }
    await libraryDao.update(userId, gameId, changes);
    return get(userId, gameId);
};

module.exports = { list, get, updateUsage };
