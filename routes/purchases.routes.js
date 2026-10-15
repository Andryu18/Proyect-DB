const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const rules = require("../validators/purchases.rules");
const purchases = require("../controllers/purchases.controller");

router.get('/', validate(rules.dailySales), purchases.dailySales);

module.exports = router;
