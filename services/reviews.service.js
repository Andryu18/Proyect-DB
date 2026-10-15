const db = require('./mysql.service');
const reviewsDao = require('../dao/reviews.dao');
const usersService = require('./users.service');
const gamesService = require('./games.service');
const purchasesService = require('./purchases.service');
const ApiError = require('../utils/ApiError');
const { requireFound } = require('../utils/checks');

const normalizeTags = (tags = []) => [...new Set(tags.map((t) => t.toLowerCase()))];

const toFields = ({ rating, comment, hoursPlayed }) => ({
    rating,
    comment: comment || null,
    hoursPlayed: hoursPlayed ?? null
});

const get = async (id) =>
    requireFound(await reviewsDao.findById(id), 'review_not_found', 'No review exists with that identifier.');

const listByGame = async (gameId) => {
    await gamesService.get(gameId);
    const reviews = await reviewsDao.listByGame(gameId);
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    return {
        gameId,
        total: reviews.length,
        averageRating: reviews.length ? Number((sum / reviews.length).toFixed(2)) : null,
        reviews
    };
};

const create = async (gameId, { userId, tags, ...data }) => {
    await gamesService.get(gameId);
    await usersService.get(userId);
    await purchasesService.requireOwnership(userId, gameId);
    if (await reviewsDao.exists(userId, gameId)) {
        throw new ApiError(409, 'review_exists', 'You already reviewed this game. You can edit your existing review.');
    }
    const id = await db.inTransaction(async (cx) => {
        const reviewId = await reviewsDao.create({ userId, gameId, ...toFields(data) }, cx);
        await reviewsDao.replaceTags(reviewId, normalizeTags(tags), cx);
        return reviewId;
    });
    return get(id);
};

const update = async (id, { tags, ...data }) => {
    await get(id);
    await db.inTransaction(async (cx) => {
        await reviewsDao.update(id, toFields(data), cx);
        await reviewsDao.replaceTags(id, normalizeTags(tags), cx);
    });
    return get(id);
};

const remove = async (id) => {
    await get(id);
    await reviewsDao.remove(id);
};

const listTags = () => reviewsDao.listTags();

module.exports = { get, listByGame, create, update, remove, listTags };
