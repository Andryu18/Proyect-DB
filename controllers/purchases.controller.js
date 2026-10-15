const purchasesService = require('../services/purchases.service');
const { sendCreated } = require('../utils/responses');

const purchase = async (req, res) => {
    const { userId, gameId } = req.data;
    const created = await purchasesService.purchase(userId, gameId);
    sendCreated(res, `/api/users/${userId}/library/${gameId}`, created);
};

const listByUser = async (req, res) => {
    res.json(await purchasesService.listByUser(req.data.userId));
};

const dailySales = async (req, res) => {
    res.json(await purchasesService.dailySales(req.data.date));
};

module.exports = { purchase, listByUser, dailySales };
