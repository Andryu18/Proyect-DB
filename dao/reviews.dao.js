const db = require('../services/mysql.service');

const SELECT_REVIEW = `
    SELECT r.id, r.game_id AS gameId, r.rating, r.comment,
           r.hours_played AS hoursPlayed, r.created_at AS createdAt,
           r.updated_at AS updatedAt,
           u.id AS userId, u.username
    FROM reviews r
    JOIN users u ON u.id = r.user_id`;

const withTags = async (rows) => {
    if (rows.length === 0) return [];
    const [tags] = await db.query(
        `SELECT rt.review_id AS reviewId, t.name
         FROM review_tags rt
         JOIN tags t ON t.id = rt.tag_id
         WHERE rt.review_id IN (?)
         ORDER BY t.name`,
        [rows.map((r) => r.id)]
    );
    return rows.map(({ userId, username, ...review }) => ({
        ...review,
        user: { id: userId, username },
        tags: tags.filter((t) => t.reviewId === review.id).map((t) => t.name)
    }));
};

const listByGame = async (gameId) => {
    const [rows] = await db.query(`${SELECT_REVIEW} WHERE r.game_id = ? ORDER BY r.created_at DESC`, [gameId]);
    return withTags(rows);
};

const findById = async (id) => {
    const [rows] = await db.query(`${SELECT_REVIEW} WHERE r.id = ?`, [id]);
    return (await withTags(rows))[0];
};

const exists = async (userId, gameId) => {
    const [rows] = await db.query(
        'SELECT 1 FROM reviews WHERE user_id = ? AND game_id = ?',
        [userId, gameId]
    );
    return rows.length > 0;
};

const create = async ({ userId, gameId, rating, comment, hoursPlayed }, cx = db) => {
    const [result] = await cx.query(
        `INSERT INTO reviews (user_id, game_id, rating, comment, hours_played)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, gameId, rating, comment, hoursPlayed]
    );
    return result.insertId;
};

const update = async (id, { rating, comment, hoursPlayed }, cx = db) => {
    await cx.query(
        'UPDATE reviews SET rating = ?, comment = ?, hours_played = ? WHERE id = ?',
        [rating, comment, hoursPlayed, id]
    );
};

const replaceTags = async (reviewId, names, cx = db) => {
    await cx.query('DELETE FROM review_tags WHERE review_id = ?', [reviewId]);
    if (names.length === 0) return;
    await cx.query('INSERT IGNORE INTO tags (name) VALUES ?', [names.map((n) => [n])]);
    await cx.query(
        `INSERT INTO review_tags (review_id, tag_id)
         SELECT ?, id FROM tags WHERE name IN (?)`,
        [reviewId, names]
    );
};

const remove = async (id) => {
    await db.query('DELETE FROM reviews WHERE id = ?', [id]);
};

const listTags = async () => {
    const [rows] = await db.query(
        `SELECT t.id, t.name, COUNT(rt.review_id) AS uses
         FROM tags t
         LEFT JOIN review_tags rt ON rt.tag_id = t.id
         GROUP BY t.id, t.name
         ORDER BY uses DESC, t.name`
    );
    return rows;
};

module.exports = { listByGame, findById, exists, create, update, replaceTags, remove, listTags };
