const db = require('./mysql.service');
const purchasesDao = require('../dao/purchases.dao');
const libraryDao = require('../dao/library.dao');
const usersService = require('./users.service');
const gamesService = require('./games.service');
const ApiError = require('../utils/ApiError');

const ALREADY_OWNED = () =>
    new ApiError(409, 'game_already_owned', 'This game is already in your library; there is no need to buy it again.');

const requireOwnership = async (userId, gameId) => {
    if (!(await purchasesDao.exists(userId, gameId))) {
        throw new ApiError(403, 'game_not_owned', 'This operation requires having purchased the game.');
    }
};

const purchase = async (userId, gameId) => {
    const user = await usersService.get(userId);
    if (user.status === 'suspended') {
        throw new ApiError(403, 'account_suspended', 'This account is suspended and cannot make purchases.');
    }
    const game = await gamesService.get(gameId);
    if (await purchasesDao.exists(userId, gameId)) throw ALREADY_OWNED();

    try {
        const id = await db.inTransaction(async (cx) => {
            const purchaseId = await purchasesDao.create({ userId, gameId, pricePaid: game.price }, cx);
            await libraryDao.create(userId, gameId, cx);
            return purchaseId;
        });
        return purchasesDao.findById(id);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') throw ALREADY_OWNED();
        throw err;
    }
};

const listByUser = async (userId) => {
    await usersService.get(userId);
    return purchasesDao.listByUser(userId);
};

const today = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const dailySales = async (date = today()) => {
    const sales = await purchasesDao.listByDate(date);
    const total = sales.reduce((sum, s) => sum + s.pricePaid, 0);
    return { date, salesCount: sales.length, total: Number(total.toFixed(2)), sales };
};

module.exports = { requireOwnership, purchase, listByUser, dailySales };
