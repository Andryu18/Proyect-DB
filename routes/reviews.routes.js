const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const rules = require("../validators/reviews.rules");
const reviews = require("../controllers/reviews.controller");

router.get('/:reviewId', validate(rules.byId), reviews.get);
router.put('/:reviewId', validate(rules.edit), reviews.update);
router.delete('/:reviewId', validate(rules.byId), reviews.remove);

module.exports = router;
