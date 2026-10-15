const db = require('../services/mysql.service');

const listByGame = async (userId, gameId) => {
    const [rows] = await db.query(
        `SELECT a.id, a.name, a.description, a.type, a.target,
                COALESCE(ap.progress, 0) AS progress, ap.unlocked_at AS unlockedAt
         FROM achievements a
         LEFT JOIN achievement_progress ap ON ap.achievement_id = a.id AND ap.user_id = ?
         WHERE a.game_id = ?
         ORDER BY a.id`,
        [userId, gameId]
    );
    return rows;
};

const find = async (userId, achievementId) => {
    const [rows] = await db.query(
        `SELECT progress, unlocked_at AS unlockedAt
         FROM achievement_progress WHERE user_id = ? AND achievement_id = ?`,
        [userId, achievementId]
    );
    return rows[0];
};

const countByAchievement = async (achievementId) => {
    const [rows] = await db.query(
        'SELECT COUNT(*) AS total FROM achievement_progress WHERE achievement_id = ?', [achievementId]
    );
    return rows[0].total;
};

const save = async ({ userId, achievementId, progress, unlock }) => {
    await db.query(
        `INSERT INTO achievement_progress (user_id, achievement_id, progress, unlocked_at)
         VALUES (?, ?, ?, IF(?, NOW(), NULL))
         ON DUPLICATE KEY UPDATE
           progress = VALUES(progress),
           unlocked_at = COALESCE(unlocked_at, VALUES(unlocked_at))`,
        [userId, achievementId, progress, unlock]
    );
};

module.exports = { listByGame, find, countByAchievement, save };
