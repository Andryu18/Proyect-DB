const { ref, listOf } = require('./helpers');

const dateTime = { type: 'string', format: 'date-time' };
const ageRating = { type: 'string', enum: ['E', 'E10+', 'T', 'M', 'AO', 'RP'], description: 'ESRB rating.' };
const achievementType = { type: 'string', enum: ['simple', 'progress', 'dated'] };
const userSummary = { type: 'object', properties: { id: { type: 'integer' }, username: { type: 'string' } } };

const schemas = {
    Error: {
        type: 'object',
        properties: {
            error: {
                type: 'object',
                required: ['code', 'message'],
                properties: {
                    code: { type: 'string', description: 'Stable code, meant for the client program.' },
                    message: { type: 'string', description: 'What happened and what the user can do.' },
                    details: {
                        type: 'array',
                        description: 'Validation errors only: one item per rejected field.',
                        items: {
                            type: 'object',
                            properties: { field: { type: 'string' }, message: { type: 'string' } }
                        }
                    }
                }
            }
        }
    },
    User: {
        type: 'object',
        description: 'The password is never part of the representation.',
        properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'admin'] },
            status: { type: 'string', enum: ['active', 'suspended'] },
            createdAt: dateTime
        },
        example: {
            id: 2, username: 'jvelasco', email: 'jvelasco@gamezone.test',
            role: 'user', status: 'active', createdAt: '2026-10-13T15:04:05.000Z'
        }
    },
    Credentials: {
        type: 'object',
        required: ['username', 'password'],
        properties: { username: { type: 'string' }, password: { type: 'string', format: 'password' } }
    },
    LoginResult: {
        type: 'object',
        properties: { message: { type: 'string', example: 'Valid credentials.' }, user: ref('User') }
    },
    UserRegistration: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
            username: { type: 'string', pattern: '^[A-Za-z0-9_.-]{3,30}$' },
            email: { type: 'string', format: 'email', maxLength: 254 },
            password: { type: 'string', format: 'password', minLength: 8, maxLength: 72 }
        }
    },
    StatusChange: {
        type: 'object',
        required: ['status'],
        properties: { status: { type: 'string', enum: ['active', 'suspended'] } }
    },
    Genre: {
        type: 'object',
        properties: { id: { type: 'integer' }, name: { type: 'string' } },
        example: { id: 1, name: 'Action' }
    },
    GenreInput: {
        type: 'object',
        required: ['name'],
        properties: { name: { type: 'string', maxLength: 50 } }
    },
    Game: {
        type: 'object',
        properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            price: { type: 'number', description: 'Current price.' },
            ageRating,
            description: { type: 'string' },
            genre: ref('Genre'),
            createdAt: dateTime
        },
        example: {
            id: 1, name: 'Steel Shadows', price: 129900, ageRating: 'M',
            description: 'Melee combat in a city under siege.',
            genre: { id: 1, name: 'Action' }, createdAt: '2026-10-13T15:04:05.000Z'
        }
    },
    GameInput: {
        type: 'object',
        required: ['name', 'price', 'genreId', 'ageRating', 'description'],
        properties: {
            name: { type: 'string', maxLength: 120 },
            price: { type: 'number', minimum: 0, description: 'At most two decimal places.' },
            genreId: { type: 'integer', minimum: 1 },
            ageRating,
            description: { type: 'string', maxLength: 5000 }
        }
    },
    GamePage: {
        type: 'object',
        properties: {
            data: listOf('Game'),
            pagination: {
                type: 'object',
                properties: {
                    page: { type: 'integer', example: 1 },
                    limit: { type: 'integer', example: 20 },
                    total: { type: 'integer', example: 6 },
                    totalPages: { type: 'integer', example: 1 }
                }
            }
        }
    },
    Purchase: {
        type: 'object',
        properties: {
            id: { type: 'integer' },
            purchasedAt: dateTime,
            pricePaid: { type: 'number', description: 'Price in force at the moment of the purchase.' },
            user: userSummary,
            game: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' } } }
        },
        example: {
            id: 5, purchasedAt: '2026-10-13T15:04:05.000Z', pricePaid: 99900,
            user: { id: 2, username: 'jvelasco' }, game: { id: 3, name: 'Empires at War' }
        }
    },
    PurchaseInput: {
        type: 'object',
        required: ['gameId'],
        properties: { gameId: { type: 'integer', minimum: 1 } }
    },
    SalesReport: {
        type: 'object',
        properties: {
            date: { type: 'string', format: 'date', example: '2026-10-13' },
            salesCount: { type: 'integer', example: 2 },
            total: { type: 'number', example: 279800 },
            sales: listOf('Purchase')
        }
    },
    LibraryEntry: {
        type: 'object',
        properties: {
            gameId: { type: 'integer' },
            name: { type: 'string' },
            genre: { type: 'string' },
            status: {
                type: 'string', enum: ['downloaded', 'played', 'not_played'],
                description: 'Computed: downloaded if installed; played if it has a last session; not_played otherwise.'
            },
            downloaded: { type: 'boolean' },
            hoursPlayed: { type: 'number' },
            lastPlayedAt: { ...dateTime, nullable: true },
            purchasedAt: dateTime,
            totalAchievements: { type: 'integer' },
            unlockedAchievements: { type: 'integer' }
        },
        example: {
            gameId: 1, name: 'Steel Shadows', genre: 'Action', status: 'downloaded',
            downloaded: true, hoursPlayed: 34.5, lastPlayedAt: '2026-10-12T15:04:05.000Z',
            purchasedAt: '2026-10-03T15:04:05.000Z', totalAchievements: 3, unlockedAchievements: 1
        }
    },
    LibraryUsage: {
        type: 'object',
        description: 'At least one of the three fields.',
        properties: {
            downloaded: { type: 'boolean' },
            hoursPlayed: { type: 'number', minimum: 0 },
            lastPlayedAt: dateTime
        }
    },
    Review: {
        type: 'object',
        properties: {
            id: { type: 'integer' },
            gameId: { type: 'integer' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            comment: { type: 'string', nullable: true },
            hoursPlayed: { type: 'number', nullable: true },
            tags: { type: 'array', items: { type: 'string' } },
            user: userSummary,
            createdAt: dateTime,
            updatedAt: dateTime
        },
        example: {
            id: 1, gameId: 1, rating: 5, comment: 'Combat is demanding and very satisfying.',
            hoursPlayed: 30, tags: ['hard', 'single player'], user: { id: 2, username: 'jvelasco' },
            createdAt: '2026-10-13T15:04:05.000Z', updatedAt: '2026-10-13T15:04:05.000Z'
        }
    },
    ReviewEdit: {
        type: 'object',
        required: ['rating'],
        properties: {
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            comment: { type: 'string', maxLength: 2000, nullable: true },
            hoursPlayed: { type: 'number', minimum: 0, nullable: true },
            tags: { type: 'array', maxItems: 10, items: { type: 'string', maxLength: 30 } }
        }
    },
    ReviewInput: {
        allOf: [
            {
                type: 'object',
                required: ['userId'],
                properties: { userId: { type: 'integer', minimum: 1, description: 'Author of the review.' } }
            },
            ref('ReviewEdit')
        ]
    },
    GameReviews: {
        type: 'object',
        properties: {
            gameId: { type: 'integer', example: 1 },
            total: { type: 'integer', example: 2 },
            averageRating: { type: 'number', nullable: true, example: 4.5 },
            reviews: listOf('Review')
        }
    },
    Tag: {
        type: 'object',
        properties: {
            id: { type: 'integer' }, name: { type: 'string' },
            uses: { type: 'integer', description: 'Number of reviews carrying the tag.' }
        },
        example: { id: 1, name: 'hard', uses: 1 }
    },
    Achievement: {
        type: 'object',
        properties: {
            id: { type: 'integer' },
            gameId: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            type: achievementType,
            target: { type: 'integer', nullable: true, description: 'Progress achievements only.' }
        },
        example: { id: 2, gameId: 1, name: 'Hunter', description: 'Defeat 100 enemies.', type: 'progress', target: 100 }
    },
    AchievementInput: {
        type: 'object',
        required: ['name', 'description', 'type'],
        properties: {
            name: { type: 'string', maxLength: 80 },
            description: { type: 'string', maxLength: 255 },
            type: achievementType,
            target: { type: 'integer', minimum: 1, description: 'Required when type is progress; not allowed otherwise.' }
        }
    },
    AchievementState: {
        type: 'object',
        properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            type: achievementType,
            target: { type: 'integer', nullable: true },
            progress: { type: 'integer', description: 'Meaningful on progress achievements.' },
            unlocked: { type: 'boolean' },
            unlockedAt: { ...dateTime, nullable: true }
        },
        example: {
            id: 2, name: 'Hunter', description: 'Defeat 100 enemies.', type: 'progress', target: 100,
            progress: 64, unlocked: false, unlockedAt: null
        }
    },
    UserAchievements: {
        type: 'object',
        properties: {
            gameId: { type: 'integer', example: 1 },
            total: { type: 'integer', example: 3 },
            unlockedCount: { type: 'integer', example: 1 },
            achievements: listOf('AchievementState')
        }
    },
    ProgressInput: {
        type: 'object',
        description: 'Progress achievement: send progress (absolute value). Simple or dated achievement: send unlocked as true.',
        properties: {
            progress: { type: 'integer', minimum: 0 },
            unlocked: { type: 'boolean' }
        }
    }
};

module.exports = schemas;
