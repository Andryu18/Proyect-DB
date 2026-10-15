const db = require('../services/mysql.service');

const COLUMNS = `id, username, email, role, status, created_at AS createdAt`;

const create = async ({ username, email, password }) => {
    const [result] = await db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
    );
    return result.insertId;
};

const findById = async (id) => {
    const [rows] = await db.query(`SELECT ${COLUMNS} FROM users WHERE id = ?`, [id]);
    return rows[0];
};

const findCredentials = async (username) => {
    const [rows] = await db.query(
        `SELECT ${COLUMNS}, password FROM users WHERE username = ?`,
        [username]
    );
    return rows[0];
};

const findByUsernameOrEmail = async (username, email) => {
    const [rows] = await db.query(
        `SELECT ${COLUMNS} FROM users WHERE username = ? OR email = ?`,
        [username, email]
    );
    return rows;
};

const list = async (status) => {
    const [rows] = await db.query(
        `SELECT ${COLUMNS} FROM users WHERE (? IS NULL OR status = ?) ORDER BY id`,
        [status ?? null, status ?? null]
    );
    return rows;
};

const updateStatus = async (id, status) => {
    await db.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
};

module.exports = { create, findById, findCredentials, findByUsernameOrEmail, list, updateStatus };
