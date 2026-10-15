const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const gameRules = require("../validators/games.rules");
const reviewRules = require("../validators/reviews.rules");
const achievementRules = require("../validators/achievements.rules");
const games = require("../controllers/games.controller");
const reviews = require("../controllers/reviews.controller");
const achievements = require("../controllers/achievements.controller");

router.get('/', validate(gameRules.list), games.list);
router.post('/', validate(gameRules.fields), games.create);
router.get('/:gameId', validate(gameRules.byId), games.get);
router.put('/:gameId', validate(gameRules.edit), games.update);

router.get('/:gameId/reviews', validate(gameRules.byId), reviews.listByGame);
router.post('/:gameId/reviews', validate(reviewRules.creation), reviews.create);
router.get('/:gameId/achievements', validate(gameRules.byId), achievements.listByGame);
router.post('/:gameId/achievements', validate(achievementRules.creation), achievements.create);

module.exports = router;
