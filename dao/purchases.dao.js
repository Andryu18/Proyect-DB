const db = require('../services/mysql.service');

const SELECT_PURCHASE = `
    SELECT p.id, p.purchased_at AS purchasedAt, p.price_paid AS pricePaid,
           u.id AS userId, u.username,
           g.id AS gameId, g.name AS gameName
    FROM purchases p
    JOIN users u ON u.id = p.user_id
    JOIN games g ON g.id = p.game_id`;

const toPurchase = ({ userId, username, gameId, gameName, ...purchase }) => ({
    ...purchase,
    user: { id: userId, username },
    game: { id: gameId, name: gameName }
});

const create = async ({ userId, gameId, pricePaid }, cx = db) => {
    const [result] = await cx.query(
        'INSERT INTO purchases (user_id, game_id, price_paid) VALUES (?, ?, ?)',
        [userId, gameId, pricePaid]
    );
    return result.insertId;
};

const exists = async (userId, gameId) => {
    const [rows] = await db.query(
        'SELECT 1 FROM purchases WHERE user_id = ? AND game_id = ?',
        [userId, gameId]
    );
    return rows.length > 0;
};

const findById = async (id) => {
    const [rows] = await db.query(`${SELECT_PURCHASE} WHERE p.id = ?`, [id]);
    return rows[0] && toPurchase(rows[0]);
};

const listByUser = async (userId) => {
    const [rows] = await db.query(
        `${SELECT_PURCHASE} WHERE p.user_id = ? ORDER BY p.purchased_at DESC`,
        [userId]
    );
    return rows.map(toPurchase);
};

const listByDate = async (date) => {
    const [rows] = await db.query(
        `${SELECT_PURCHASE}
         WHERE p.purchased_at >= ? AND p.purchased_at < DATE_ADD(?, INTERVAL 1 DAY)
         ORDER BY p.purchased_at`,
        [date, date]
    );
    return rows.map(toPurchase);
};

module.exports = { create, exists, findById, listByUser, listByDate };
