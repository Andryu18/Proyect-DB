# GameZone API

REST API for GameZone, a video game store platform. Relational data model and
backend, with no web interface.

Node.js + Express 5 + MySQL 8 (`mysql2`).

## Getting started

Requirements: Node.js 18 or later and a running MySQL 8 server.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create the configuration file by copying `.env.example` to `.env`, then set
   `DB_PASSWORD` to the password of your MySQL user:

   ```bash
   cp .env.example .env
   ```

3. Create the `gamezone` database with its test data:

   ```bash
   npm run db:init
   ```

   Alternatively, run `db/schema.sql` and then `db/seed.sql` from MySQL
   Workbench. The schema script drops and recreates the database, so it also
   restores the initial state.

4. Start the server:

   ```bash
   npm start
   ```

With the default configuration the API is served at `http://localhost:5000/api`.

## Configuration

Every configurable value lives in `.env`, which is not committed:

| Variable      | Meaning                          |
|---------------|----------------------------------|
| `PORT`        | Port the server listens on       |
| `DB_HOST`     | MySQL host                       |
| `DB_PORT`     | MySQL port                       |
| `DB_USER`     | MySQL user                       |
| `DB_PASSWORD` | Password of that user            |
| `DB_NAME`     | Database name                    |

## Documentation

Interactive Swagger UI: <http://localhost:5000/api-docs>

The Postman collection is in `postman/GameZone.postman_collection.json`. It uses
the identifiers of the test data, so run `npm run db:init` before going through
it.

## Test data

| Username   | Password       | Role  | Status    |
|------------|----------------|-------|-----------|
| `admin`    | `Admin12345`   | admin | active    |
| `jvelasco` | `Player12345`  | user  | active    |
| `aclavijo` | `Player67890`  | user  | active    |
| `dbolanos` | `Suspended123` | user  | suspended |

## Architecture

Every request crosses the layers in a single direction:

```
routes  ->  validators  ->  controllers  ->  services  ->  dao  ->  MySQL
```

| Folder         | Responsibility                                                              |
|----------------|-----------------------------------------------------------------------------|
| `routes/`      | Maps each verb and URI to its validation rules and its controller.          |
| `validators/`  | Input format rules: types, required fields, ranges.                         |
| `middlewares/` | Runs the validation and turns errors into HTTP responses.                   |
| `controllers/` | Translates between HTTP and the services.                                   |
| `services/`    | Business rules and transactions. `mysql.service.js` exposes the pool.       |
| `dao/`         | The only place with SQL. Returns plain objects and knows nothing about HTTP.|
| `utils/`       | Shared error class, checks and responses.                                   |
| `docs/`        | OpenAPI document.                                                           |
| `db/`          | Schema and test data.                                                       |

Each layer has one file per resource: sessions, users, genres, games, purchases,
library, reviews, achievements and achievement progress.

## Endpoints

| Method | Route (under `/api`)                                    | Purpose                                  |
|--------|---------------------------------------------------------|------------------------------------------|
| POST   | `/sessions`                                             | Log in: verify credentials               |
| POST   | `/users`                                                | Register a user                          |
| GET    | `/users`                                                | List users (`?status=`)                  |
| GET    | `/users/{userId}`                                       | Get a user                               |
| PATCH  | `/users/{userId}`                                       | Suspend or reactivate                    |
| POST   | `/users/{userId}/purchases`                             | Buy a game                               |
| GET    | `/users/{userId}/purchases`                             | Purchase history                         |
| GET    | `/users/{userId}/library`                               | Library of the user                      |
| GET    | `/users/{userId}/library/{gameId}`                      | One game of the library                  |
| PATCH  | `/users/{userId}/library/{gameId}`                      | Update usage data                        |
| GET    | `/users/{userId}/games/{gameId}/achievements`           | Achievements of the game with the user's progress |
| PUT    | `/users/{userId}/achievements/{achievementId}/progress` | Record progress or unlocking             |
| GET    | `/purchases`                                            | Sales of the day (`?date=YYYY-MM-DD`)    |
| GET    | `/genres`                                               | List genres                              |
| POST   | `/genres`                                               | Create a genre                           |
| GET    | `/genres/{genreId}`                                     | Get a genre                              |
| PUT    | `/genres/{genreId}`                                     | Rename a genre                           |
| DELETE | `/genres/{genreId}`                                     | Delete a genre with no games             |
| GET    | `/games`                                                | Catalog (`?genreId=&page=&limit=`)       |
| POST   | `/games`                                                | Add a game                               |
| GET    | `/games/{gameId}`                                       | Game details                             |
| PUT    | `/games/{gameId}`                                       | Update a game                            |
| GET    | `/games/{gameId}/reviews`                               | Reviews of the game                      |
| POST   | `/games/{gameId}/reviews`                               | Publish a review                         |
| GET    | `/reviews/{reviewId}`                                   | Get a review                             |
| PUT    | `/reviews/{reviewId}`                                   | Edit a review                            |
| DELETE | `/reviews/{reviewId}`                                   | Delete a review                          |
| GET    | `/tags`                                                 | Tags and number of uses                  |
| GET    | `/games/{gameId}/achievements`                          | Achievements defined for the game        |
| POST   | `/games/{gameId}/achievements`                          | Define an achievement                    |
| GET    | `/achievements/{achievementId}`                         | Get an achievement                       |
| PUT    | `/achievements/{achievementId}`                         | Update an achievement                    |
| DELETE | `/achievements/{achievementId}`                         | Delete an achievement with no progress   |

All errors share the same format:

```json
{ "error": { "code": "game_already_owned", "message": "This game is already in your library; there is no need to buy it again." } }
```

## Scope of this milestone

- The password is stored **as plain text**, as the assignment requires.
  Verification is isolated in `services/auth.service.js`, so adopting the
  derived value (RF-02) is a local change.
- Logging in verifies credentials but issues no session token yet. For that
  reason the acting user is identified in the URI and administration operations
  do not require a role yet (RF-05 and RF-23 remain pending).
