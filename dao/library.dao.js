const db = require('../services/mysql.service');

const SELECT_ENTRY = `
    SELECT g.id AS gameId, g.name, ge.name AS genre,
           l.downloaded, l.hours_played AS hoursPlayed, l.last_played_at AS lastPlayedAt,
           p.purchased_at AS purchasedAt,
           (SELECT COUNT(*) FROM achievements a WHERE a.game_id = g.id) AS totalAchievements,
           (SELECT COUNT(*)
              FROM achievement_progress ap
              JOIN achievements a ON a.id = ap.achievement_id
             WHERE a.game_id = g.id AND ap.user_id = l.user_id
               AND ap.unlocked_at IS NOT NULL) AS unlockedAchievements
    FROM library_entries l
    JOIN purchases p ON p.user_id = l.user_id AND p.game_id = l.game_id
    JOIN games g ON g.id = l.game_id
    JOIN genres ge ON ge.id = g.genre_id`;

const toEntry = (row) => ({ ...row, downloaded: Boolean(row.downloaded) });

const create = async (userId, gameId, cx = db) => {
    await cx.query(
        'INSERT INTO library_entries (user_id, game_id) VALUES (?, ?)',
        [userId, gameId]
    );
};

const listByUser = async (userId) => {
    const [rows] = await db.query(`${SELECT_ENTRY} WHERE l.user_id = ? ORDER BY g.name`, [userId]);
    return rows.map(toEntry);
};

const find = async (userId, gameId) => {
    const [rows] = await db.query(
        `${SELECT_ENTRY} WHERE l.user_id = ? AND l.game_id = ?`,
        [userId, gameId]
    );
    return rows[0] && toEntry(rows[0]);
};

const update = async (userId, gameId, changes) => {
    await db.query(
        'UPDATE library_entries SET ? WHERE user_id = ? AND game_id = ?',
        [changes, userId, gameId]
    );
};

module.exports = { create, listByUser, find, update };
