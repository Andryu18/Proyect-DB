const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const userRules = require("../validators/users.rules");
const purchaseRules = require("../validators/purchases.rules");
const libraryRules = require("../validators/library.rules");
const achievementRules = require("../validators/achievements.rules");
const users = require("../controllers/users.controller");
const purchases = require("../controllers/purchases.controller");
const library = require("../controllers/library.controller");
const progress = require("../controllers/progress.controller");

router.post('/', validate(userRules.registration), users.register);
router.get('/', validate(userRules.list), users.list);
router.get('/:userId', validate(userRules.byId), users.get);
router.patch('/:userId', validate(userRules.statusChange), users.changeStatus);

router.post('/:userId/purchases', validate(purchaseRules.purchase), purchases.purchase);
router.get('/:userId/purchases', validate(userRules.byId), purchases.listByUser);

router.get('/:userId/library', validate(userRules.byId), library.list);
router.get('/:userId/library/:gameId', validate(libraryRules.entry), library.get);
router.patch('/:userId/library/:gameId', validate(libraryRules.usage), library.updateUsage);

router.get('/:userId/games/:gameId/achievements', validate(libraryRules.entry), progress.listByGame);
router.put('/:userId/achievements/:achievementId/progress',
    validate(achievementRules.userProgress), progress.record);

module.exports = router;
