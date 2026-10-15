const {
    ref, listOf, ok, created, noContent, error, invalid, notFound, notOwned, pathId, requestBody
} = require('./helpers');

const userId = pathId('userId', 'User identifier.');
const gameId = pathId('gameId', 'Game identifier.');
const genreId = pathId('genreId', 'Genre identifier.');
const reviewId = pathId('reviewId', 'Review identifier.');
const achievementId = pathId('achievementId', 'Achievement identifier.');

const paths = {
    '/sessions': {
        post: {
            tags: ['Authentication'],
            summary: 'Log in',
            description: 'Receives username and password and verifies them against the stored data. In this milestone no session token is issued yet.',
            requestBody: requestBody('Credentials', { username: 'jvelasco', password: 'Player12345' }),
            responses: {
                200: ok('Valid credentials.', ref('LoginResult')),
                400: invalid,
                401: error('Wrong username or password.', 'invalid_credentials', 'The username or the password is incorrect.'),
                403: error('The account is suspended.', 'account_suspended', 'This account is suspended. Contact the administrator.')
            }
        }
    },
    '/users': {
        post: {
            tags: ['Users'],
            summary: 'Register a user',
            requestBody: requestBody('UserRegistration', { username: 'new.player', email: 'new@gamezone.test', password: 'TestPassword1' }),
            responses: {
                201: created('User created.', ref('User')),
                400: invalid,
                409: error('The username or the email is already registered.', 'username_taken', 'That username is already registered. Choose another one.')
            }
        },
        get: {
            tags: ['Users'],
            summary: 'List registered users',
            description: 'Administration operation (HU-14).',
            parameters: [{ name: 'status', in: 'query', description: 'Filter by status.', schema: { type: 'string', enum: ['active', 'suspended'] } }],
            responses: { 200: ok('List of users.', listOf('User')), 400: invalid }
        }
    },
    '/users/{userId}': {
        get: {
            tags: ['Users'],
            summary: 'Get a user',
            parameters: [userId],
            responses: { 200: ok('User.', ref('User')), 400: invalid, 404: notFound('user', 'user_not_found') }
        },
        patch: {
            tags: ['Users'],
            summary: 'Suspend or reactivate an account',
            description: 'Administration operation (HU-14). The status is the only modifiable attribute.',
            parameters: [userId],
            requestBody: requestBody('StatusChange', { status: 'suspended' }),
            responses: { 200: ok('User updated.', ref('User')), 400: invalid, 404: notFound('user', 'user_not_found') }
        }
    },
    '/users/{userId}/purchases': {
        post: {
            tags: ['Purchases'],
            summary: 'Buy a game',
            description: 'Records the purchase with the current price and creates the library entry in the same transaction.',
            parameters: [userId],
            requestBody: requestBody('PurchaseInput', { gameId: 3 }),
            responses: {
                201: created('Purchase recorded. Location points to the library entry.', ref('Purchase')),
                400: invalid,
                403: error('The account is suspended.', 'account_suspended', 'This account is suspended and cannot make purchases.'),
                404: notFound('user or game', 'game_not_found'),
                409: error('The user already owns the game.', 'game_already_owned', 'This game is already in your library; there is no need to buy it again.')
            }
        },
        get: {
            tags: ['Purchases'],
            summary: 'Purchase history of a user',
            parameters: [userId],
            responses: { 200: ok('Purchases, most recent first.', listOf('Purchase')), 400: invalid, 404: notFound('user', 'user_not_found') }
        }
    },
    '/purchases': {
        get: {
            tags: ['Purchases'],
            summary: 'Sales of a day, with their total',
            description: 'Administration operation (HU-13). Without the parameter it returns today\'s sales.',
            parameters: [{ name: 'date', in: 'query', description: 'Day to query (YYYY-MM-DD).', schema: { type: 'string', format: 'date' }, example: '2026-10-13' }],
            responses: { 200: ok('Sales of the day.', ref('SalesReport')), 400: invalid }
        }
    },
    '/users/{userId}/library': {
        get: {
            tags: ['Library'],
            summary: 'Library of a user',
            description: 'Purchased games with their usage status and the achievement summary of each one.',
            parameters: [userId],
            responses: { 200: ok('Library entries.', listOf('LibraryEntry')), 400: invalid, 404: notFound('user', 'user_not_found') }
        }
    },
    '/users/{userId}/library/{gameId}': {
        get: {
            tags: ['Library'],
            summary: 'Get a game from the library',
            parameters: [userId, gameId],
            responses: {
                200: ok('Library entry.', ref('LibraryEntry')),
                400: invalid,
                404: error('The user does not exist or does not own that game.', 'game_not_in_library', 'That game is not in the user\'s library.')
            }
        },
        patch: {
            tags: ['Library'],
            summary: 'Update the usage data of a game',
            description: 'External input: reported by the game client. Only the submitted fields are modified.',
            parameters: [userId, gameId],
            requestBody: requestBody('LibraryUsage', { downloaded: true, hoursPlayed: 36, lastPlayedAt: '2026-10-13T20:30:00Z' }),
            responses: {
                200: ok('Entry updated.', ref('LibraryEntry')),
                400: invalid,
                404: error('The user does not exist or does not own that game.', 'game_not_in_library', 'That game is not in the user\'s library.')
            }
        }
    },
    '/users/{userId}/games/{gameId}/achievements': {
        get: {
            tags: ['Achievement progress'],
            summary: 'Achievements of a game with the user\'s progress',
            description: 'Composite endpoint: joins the achievement definitions of the game with the user\'s state on each one (HU-10).',
            parameters: [userId, gameId],
            responses: {
                200: ok('Achievements with state and progress.', ref('UserAchievements')),
                400: invalid,
                403: notOwned,
                404: notFound('user or game', 'game_not_found')
            }
        }
    },
    '/users/{userId}/achievements/{achievementId}/progress': {
        put: {
            tags: ['Achievement progress'],
            summary: 'Record the progress or the unlocking of an achievement',
            description: 'External input: reported by the game client. Idempotent: the absolute progress value is sent, not an increment. The unlock date is recorded only once, for every achievement type.',
            parameters: [userId, achievementId],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: ref('ProgressInput'),
                        examples: {
                            progress: { summary: 'Progress achievement', value: { progress: 80 } },
                            unlock: { summary: 'Simple or dated achievement', value: { unlocked: true } }
                        }
                    }
                }
            },
            responses: {
                200: ok('State of the achievement for the user.', ref('AchievementState')),
                400: invalid,
                403: notOwned,
                404: notFound('user or achievement', 'achievement_not_found')
            }
        }
    },
    '/genres': {
        get: {
            tags: ['Genres'],
            summary: 'List genres',
            responses: { 200: ok('Genres in alphabetical order.', listOf('Genre')) }
        },
        post: {
            tags: ['Genres'],
            summary: 'Create a genre',
            requestBody: requestBody('GenreInput', { name: 'Simulation' }),
            responses: {
                201: created('Genre created.', ref('Genre')),
                400: invalid,
                409: error('A genre with that name already exists.', 'genre_exists', 'A genre with that name already exists.')
            }
        }
    },
    '/genres/{genreId}': {
        get: {
            tags: ['Genres'],
            summary: 'Get a genre',
            parameters: [genreId],
            responses: { 200: ok('Genre.', ref('Genre')), 400: invalid, 404: notFound('genre', 'genre_not_found') }
        },
        put: {
            tags: ['Genres'],
            summary: 'Rename a genre',
            parameters: [genreId],
            requestBody: requestBody('GenreInput', { name: 'Action and stealth' }),
            responses: {
                200: ok('Genre updated.', ref('Genre')),
                400: invalid,
                404: notFound('genre', 'genre_not_found'),
                409: error('A genre with that name already exists.', 'genre_exists', 'A genre with that name already exists.')
            }
        },
        delete: {
            tags: ['Genres'],
            summary: 'Delete a genre that has no games',
            parameters: [genreId],
            responses: {
                204: noContent,
                400: invalid,
                404: notFound('genre', 'genre_not_found'),
                409: error('The genre has games assigned.', 'genre_in_use', 'The genre has games assigned. Reassign those games before deleting it.')
            }
        }
    },
    '/games': {
        get: {
            tags: ['Games'],
            summary: 'Paginated catalog, with genre filter',
            parameters: [
                { name: 'genreId', in: 'query', description: 'Only games of this genre.', schema: { type: 'integer', minimum: 1 } },
                { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
                { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } }
            ],
            responses: { 200: ok('Catalog page.', ref('GamePage')), 400: invalid }
        },
        post: {
            tags: ['Games'],
            summary: 'Add a game to the catalog',
            description: 'Administration operation (HU-11).',
            requestBody: requestBody('GameInput', {
                name: 'Night Circuit', price: 119900, genreId: 4, ageRating: 'E',
                description: 'Street racing with dynamic weather.'
            }),
            responses: {
                201: created('Game created.', ref('Game')),
                400: invalid,
                404: notFound('genre', 'genre_not_found'),
                409: error('A game with that name already exists.', 'game_exists', 'A game with that name already exists in the catalog.')
            }
        }
    },
    '/games/{gameId}': {
        get: {
            tags: ['Games'],
            summary: 'Game details',
            parameters: [gameId],
            responses: { 200: ok('Game.', ref('Game')), 400: invalid, 404: notFound('game', 'game_not_found') }
        },
        put: {
            tags: ['Games'],
            summary: 'Update a game',
            description: 'Replaces the five data fields of the game. Changing the price does not alter purchases already recorded.',
            parameters: [gameId],
            requestBody: requestBody('GameInput', {
                name: 'Steel Shadows', price: 99900, genreId: 1, ageRating: 'M',
                description: 'Melee combat in a city under siege.'
            }),
            responses: {
                200: ok('Game updated.', ref('Game')),
                400: invalid,
                404: notFound('game or genre', 'game_not_found'),
                409: error('Another game with that name already exists.', 'game_exists', 'A game with that name already exists in the catalog.')
            }
        }
    },
    '/games/{gameId}/reviews': {
        get: {
            tags: ['Reviews'],
            summary: 'Reviews of a game, with their average',
            parameters: [gameId],
            responses: { 200: ok('Reviews of the game.', ref('GameReviews')), 400: invalid, 404: notFound('game', 'game_not_found') }
        },
        post: {
            tags: ['Reviews'],
            summary: 'Publish a review',
            description: 'Only the rating is required. Tags that do not exist yet are created.',
            parameters: [gameId],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: ref('ReviewInput'),
                        examples: {
                            full: {
                                summary: 'With every field',
                                value: { userId: 2, rating: 4, comment: 'Exploration done right.', hoursPlayed: 12.5, tags: ['relaxing', 'open world'] }
                            },
                            minimal: { summary: 'Rating only', value: { userId: 2, rating: 4 } }
                        }
                    }
                }
            },
            responses: {
                201: created('Review published.', ref('Review')),
                400: invalid,
                403: notOwned,
                404: notFound('game or user', 'game_not_found'),
                409: error('The user already reviewed this game.', 'review_exists', 'You already reviewed this game. You can edit your existing review.')
            }
        }
    },
    '/reviews/{reviewId}': {
        get: {
            tags: ['Reviews'],
            summary: 'Get a review',
            parameters: [reviewId],
            responses: { 200: ok('Review.', ref('Review')), 400: invalid, 404: notFound('review', 'review_not_found') }
        },
        put: {
            tags: ['Reviews'],
            summary: 'Edit a review',
            description: 'Full replacement: optional fields that are not sent become empty.',
            parameters: [reviewId],
            requestBody: requestBody('ReviewEdit', { rating: 5, comment: 'Much better after the latest patch.', tags: ['hard'] }),
            responses: { 200: ok('Review updated.', ref('Review')), 400: invalid, 404: notFound('review', 'review_not_found') }
        },
        delete: {
            tags: ['Reviews'],
            summary: 'Delete a review',
            parameters: [reviewId],
            responses: { 204: noContent, 400: invalid, 404: notFound('review', 'review_not_found') }
        }
    },
    '/tags': {
        get: {
            tags: ['Reviews'],
            summary: 'Existing tags and their number of uses',
            responses: { 200: ok('Tags, most used first.', listOf('Tag')) }
        }
    },
    '/games/{gameId}/achievements': {
        get: {
            tags: ['Achievements'],
            summary: 'Achievements defined for a game',
            parameters: [gameId],
            responses: { 200: ok('Achievements of the game.', listOf('Achievement')), 400: invalid, 404: notFound('game', 'game_not_found') }
        },
        post: {
            tags: ['Achievements'],
            summary: 'Define an achievement for a game',
            description: 'Administration operation (HU-12).',
            parameters: [gameId],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: ref('AchievementInput'),
                        examples: {
                            progress: { summary: 'Progress', value: { name: 'Collector', description: 'Gather 50 relics.', type: 'progress', target: 50 } },
                            simple: { summary: 'Simple', value: { name: 'Welcome', description: 'Start your first match.', type: 'simple' } },
                            dated: { summary: 'Dated', value: { name: 'True Ending', description: 'Finish the game.', type: 'dated' } }
                        }
                    }
                }
            },
            responses: {
                201: created('Achievement created.', ref('Achievement')),
                400: invalid,
                404: notFound('game', 'game_not_found'),
                409: error('The game already has an achievement with that name.', 'achievement_exists', 'That game already has an achievement with that name.')
            }
        }
    },
    '/achievements/{achievementId}': {
        get: {
            tags: ['Achievements'],
            summary: 'Get an achievement',
            parameters: [achievementId],
            responses: { 200: ok('Achievement.', ref('Achievement')), 400: invalid, 404: notFound('achievement', 'achievement_not_found') }
        },
        put: {
            tags: ['Achievements'],
            summary: 'Update an achievement',
            parameters: [achievementId],
            requestBody: requestBody('AchievementInput', { name: 'Hunter', description: 'Defeat 150 enemies.', type: 'progress', target: 150 }),
            responses: {
                200: ok('Achievement updated.', ref('Achievement')),
                400: invalid,
                404: notFound('achievement', 'achievement_not_found'),
                409: error('The game already has another achievement with that name.', 'achievement_exists', 'That game already has an achievement with that name.')
            }
        },
        delete: {
            tags: ['Achievements'],
            summary: 'Delete an achievement with no recorded progress',
            parameters: [achievementId],
            responses: {
                204: noContent,
                400: invalid,
                404: notFound('achievement', 'achievement_not_found'),
                409: error('Some users have progress on the achievement.', 'achievement_has_progress', 'Some users have progress on this achievement; deleting it would erase that progress.')
            }
        }
    }
};

const internalError = error('Unexpected server error.', 'internal_error', 'An unexpected error occurred. Please try again later.');
for (const operations of Object.values(paths)) {
    for (const operation of Object.values(operations)) {
        operation.responses[500] = internalError;
    }
}

module.exports = paths;
