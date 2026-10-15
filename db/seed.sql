USE gamezone;

INSERT INTO users (id, username, email, password, role, status) VALUES
  (1, 'admin',    'admin@gamezone.test',    'Admin12345',   'admin', 'active'),
  (2, 'jvelasco', 'jvelasco@gamezone.test', 'Player12345',  'user',  'active'),
  (3, 'aclavijo', 'aclavijo@gamezone.test', 'Player67890',  'user',  'active'),
  (4, 'dbolanos', 'dbolanos@gamezone.test', 'Suspended123', 'user',  'suspended');

INSERT INTO genres (id, name) VALUES
  (1, 'Action'), (2, 'Adventure'), (3, 'Strategy'), (4, 'Sports'), (5, 'RPG');

INSERT INTO games (id, name, price, age_rating, description, genre_id) VALUES
  (1, 'Steel Shadows',        129900.00, 'M',    'Melee combat in a city under siege.', 1),
  (2, 'Road to the Horizon',   89900.00, 'E10+', 'Open-world exploration with environmental puzzles.', 2),
  (3, 'Empires at War',        99900.00, 'T',    'Turn-based strategy with historical campaigns.', 3),
  (4, 'Total League 26',      179900.00, 'E',    'Football simulator with licensed leagues.', 4),
  (5, 'Chronicles of Eldar',  149900.00, 'T',    'Classic role-playing with choices that reshape the story.', 5),
  (6, 'Orbital Assault',       59900.00, 'T',    'Zero-gravity shooter built for quick matches.', 1);

INSERT INTO achievements (id, game_id, name, description, type, target) VALUES
  (1, 1, 'First Strike',   'Complete the combat tutorial.',  'simple',   NULL),
  (2, 1, 'Hunter',         'Defeat 100 enemies.',            'progress', 100),
  (3, 1, 'City Liberated', 'Finish the main campaign.',      'dated',    NULL),
  (4, 2, 'Cartographer',   'Discover 25 map regions.',       'progress', 25),
  (5, 2, 'First Dawn',     'Survive the first night.',       'simple',   NULL),
  (6, 5, 'The Chosen One', 'Complete the prologue.',         'dated',    NULL);

INSERT INTO purchases (id, user_id, game_id, purchased_at, price_paid) VALUES
  (1, 2, 1, NOW() - INTERVAL 10 DAY, 129900.00),
  (2, 2, 2, NOW() - INTERVAL 3 DAY,   62900.00),
  (3, 3, 1, NOW(),                   129900.00),
  (4, 3, 5, NOW(),                   149900.00);

INSERT INTO library_entries (user_id, game_id, downloaded, hours_played, last_played_at) VALUES
  (2, 1, TRUE,  34.5, NOW() - INTERVAL 1 DAY),
  (2, 2, FALSE,  0.0, NULL),
  (3, 1, FALSE,  6.0, NOW()),
  (3, 5, FALSE,  0.0, NULL);

INSERT INTO reviews (id, user_id, game_id, rating, comment, hours_played) VALUES
  (1, 2, 1, 5, 'Combat is demanding and very satisfying.', 30.0),
  (2, 3, 1, 4, NULL, NULL);

INSERT INTO tags (id, name) VALUES (1, 'hard'), (2, 'single player'), (3, 'great story');
INSERT INTO review_tags (review_id, tag_id) VALUES (1, 1), (1, 2);

INSERT INTO achievement_progress (user_id, achievement_id, progress, unlocked_at) VALUES
  (2, 1,  0, NOW() - INTERVAL 9 DAY),
  (2, 2, 64, NULL);
