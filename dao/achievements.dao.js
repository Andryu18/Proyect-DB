const db = require('../services/mysql.service');

const COLUMNS = 'id, game_id AS gameId, name, description, type, target';

const listByGame = async (gameId) => {
    const [rows] = await db.query(`SELECT ${COLUMNS} FROM achievements WHERE game_id = ? ORDER BY id`, [gameId]);
    return rows;
};

const findById = async (id) => {
    const [rows] = await db.query(`SELECT ${COLUMNS} FROM achievements WHERE id = ?`, [id]);
    return rows[0];
};

const findByName = async (gameId, name) => {
    const [rows] = await db.query('SELECT id FROM achievements WHERE game_id = ? AND name = ?', [gameId, name]);
    return rows[0];
};

const create = async ({ gameId, name, description, type, target }) => {
    const [result] = await db.query(
        'INSERT INTO achievements (game_id, name, description, type, target) VALUES (?, ?, ?, ?, ?)',
        [gameId, name, description, type, target]
    );
    return result.insertId;
};

const update = async (id, { name, description, type, target }) => {
    await db.query(
        'UPDATE achievements SET name = ?, description = ?, type = ?, target = ? WHERE id = ?',
        [name, description, type, target, id]
    );
};

const remove = async (id) => {
    await db.query('DELETE FROM achievements WHERE id = ?', [id]);
};

module.exports = { listByGame, findById, findByName, create, update, remove };
