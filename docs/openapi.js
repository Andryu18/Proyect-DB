const paths = require('./paths');
const schemas = require('./schemas');

module.exports = {
    openapi: '3.0.3',
    info: {
        title: 'GameZone API',
        version: '1.0.0',
        description:
            'REST API of the GameZone video game store platform.\n\n' +
            'Scope of this milestone: the password is stored as plain text and logging in only verifies ' +
            'credentials, without issuing a session. For that reason the acting user is identified in ' +
            'the URI and administration operations do not require a role yet.\n\n' +
            'All errors share the same format: `{ "error": { "code", "message", "details?" } }`.'
    },
    servers: [{ url: '/api', description: 'Current server' }],
    tags: [
        { name: 'Authentication' },
        { name: 'Users' },
        { name: 'Genres' },
        { name: 'Games' },
        { name: 'Purchases' },
        { name: 'Library' },
        { name: 'Reviews' },
        { name: 'Achievements', description: 'Definition of the achievements of each game.' },
        { name: 'Achievement progress', description: 'State of each user regarding the achievements.' }
    ],
    paths,
    components: { schemas }
};
