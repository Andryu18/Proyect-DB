const db = require('../services/mysql.service');

const list = async () => {
    const [rows] = await db.query('SELECT id, name FROM genres ORDER BY name');
    return rows;
};

const findById = async (id) => {
    const [rows] = await db.query('SELECT id, name FROM genres WHERE id = ?', [id]);
    return rows[0];
};

const findByName = async (name) => {
    const [rows] = await db.query('SELECT id, name FROM genres WHERE name = ?', [name]);
    return rows[0];
};

const create = async (name) => {
    const [result] = await db.query('INSERT INTO genres (name) VALUES (?)', [name]);
    return result.insertId;
};

const update = async (id, name) => {
    await db.query('UPDATE genres SET name = ? WHERE id = ?', [name, id]);
};

const remove = async (id) => {
    await db.query('DELETE FROM genres WHERE id = ?', [id]);
};

const countGames = async (id) => {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM games WHERE genre_id = ?', [id]);
    return rows[0].total;
};

module.exports = { list, findById, findByName, create, update, remove, countGames };
