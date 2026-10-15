const reviewsService = require('../services/reviews.service');
const { sendCreated, sendNoContent } = require('../utils/responses');

const listByGame = async (req, res) => {
    res.json(await reviewsService.listByGame(req.data.gameId));
};

const create = async (req, res) => {
    const { gameId, ...data } = req.data;
    const review = await reviewsService.create(gameId, data);
    sendCreated(res, `/api/reviews/${review.id}`, review);
};

const get = async (req, res) => {
    res.json(await reviewsService.get(req.data.reviewId));
};

const update = async (req, res) => {
    const { reviewId, ...data } = req.data;
    res.json(await reviewsService.update(reviewId, data));
};

const remove = async (req, res) => {
    await reviewsService.remove(req.data.reviewId);
    sendNoContent(res);
};

const listTags = async (req, res) => {
    res.json(await reviewsService.listTags());
};

module.exports = { listByGame, create, get, update, remove, listTags };
