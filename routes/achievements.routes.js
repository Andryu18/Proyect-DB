const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const rules = require("../validators/achievements.rules");
const achievements = require("../controllers/achievements.controller");

router.get('/:achievementId', validate(rules.byId), achievements.get);
router.put('/:achievementId', validate(rules.edit), achievements.update);
router.delete('/:achievementId', validate(rules.byId), achievements.remove);

module.exports = router;
