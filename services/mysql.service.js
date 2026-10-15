const mysql = require('mysql2/promise');
const config = require('../env/mysqlConfig');

const pool = mysql.createPool(config);

pool.inTransaction = async (fn) => {
    const cx = await pool.getConnection();
    try {
        await cx.beginTransaction();
        const result = await fn(cx);
        await cx.commit();
        return result;
    } catch (err) {
        await cx.rollback();
        throw err;
    } finally {
        cx.release();
    }
};

module.exports = pool;
