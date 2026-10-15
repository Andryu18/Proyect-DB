const db = require('../services/mysql.service');

const SELECT_GAME = `
    SELECT g.id, g.name, g.price, g.age_rating AS ageRating,
           g.description, g.created_at AS createdAt,
           ge.id AS genreId, ge.name AS genreName
    FROM games g
    JOIN genres ge ON ge.id = g.genre_id`;

const toGame = ({ genreId, genreName, ...game }) => ({
    ...game,
    genre: { id: genreId, name: genreName }
});

const list = async ({ genreId, limit, offset }) => {
    const [rows] = await db.query(
        `${SELECT_GAME}
         WHERE (? IS NULL OR g.genre_id = ?)
         ORDER BY ge.name, g.name
         LIMIT ? OFFSET ?`,
        [genreId ?? null, genreId ?? null, limit, offset]
    );
    return rows.map(toGame);
};

const count = async (genreId) => {
    const [rows] = await db.query(
        'SELECT COUNT(*) AS total FROM games WHERE (? IS NULL OR genre_id = ?)',
        [genreId ?? null, genreId ?? null]
    );
    return rows[0].total;
};

const findById = async (id) => {
    const [rows] = await db.query(`${SELECT_GAME} WHERE g.id = ?`, [id]);
    return rows[0] && toGame(rows[0]);
};

const findByName = async (name) => {
    const [rows] = await db.query('SELECT id FROM games WHERE name = ?', [name]);
    return rows[0];
};

const create = async ({ name, price, ageRating, description, genreId }) => {
    const [result] = await db.query(
        `INSERT INTO games (name, price, age_rating, description, genre_id)
         VALUES (?, ?, ?, ?, ?)`,
        [name, price, ageRating, description, genreId]
    );
    return result.insertId;
};

const update = async (id, { name, price, ageRating, description, genreId }) => {
    await db.query(
        `UPDATE games
         SET name = ?, price = ?, age_rating = ?, description = ?, genre_id = ?
         WHERE id = ?`,
        [name, price, ageRating, description, genreId, id]
    );
};

module.exports = { list, count, findById, findByName, create, update };
