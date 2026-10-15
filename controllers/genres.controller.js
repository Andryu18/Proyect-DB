const genresService = require('../services/genres.service');
const { sendCreated, sendNoContent } = require('../utils/responses');

const list = async (req, res) => {
    res.json(await genresService.list());
};

const get = async (req, res) => {
    res.json(await genresService.get(req.data.genreId));
};

const create = async (req, res) => {
    const genre = await genresService.create(req.data.name);
    sendCreated(res, `/api/genres/${genre.id}`, genre);
};

const update = async (req, res) => {
    res.json(await genresService.update(req.data.genreId, req.data.name));
};

const remove = async (req, res) => {
    await genresService.remove(req.data.genreId);
    sendNoContent(res);
};

module.exports = { list, get, create, update, remove };
