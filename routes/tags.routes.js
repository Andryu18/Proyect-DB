const express = require("express");
const router = express.Router();
const reviews = require("../controllers/reviews.controller");

router.get('/', reviews.listTags);

module.exports = router;
