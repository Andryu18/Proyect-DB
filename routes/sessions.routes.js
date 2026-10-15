const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const rules = require("../validators/users.rules");
const auth = require("../controllers/auth.controller");

router.post('/', validate(rules.login), auth.login);

module.exports = router;
