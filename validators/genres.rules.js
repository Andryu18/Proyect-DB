const { id, text } = require('./common.rules');

const MAX_NAME_LENGTH = 50;

const fields = [text('name', MAX_NAME_LENGTH)];

const byId = [id('genreId')];

const edit = [...byId, ...fields];

module.exports = { fields, byId, edit };
