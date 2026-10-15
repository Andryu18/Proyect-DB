const express = require("express");
const router = express.Router();

router.use('/sessions', require("./sessions.routes"));
router.use('/users', require("./users.routes"));
router.use('/genres', require("./genres.routes"));
router.use('/games', require("./games.routes"));
router.use('/reviews', require("./reviews.routes"));
router.use('/achievements', require("./achievements.routes"));
router.use('/purchases', require("./purchases.routes"));
router.use('/tags', require("./tags.routes"));

module.exports = router;
