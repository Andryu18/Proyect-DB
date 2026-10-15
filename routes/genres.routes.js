const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const rules = require("../validators/genres.rules");
const genres = require("../controllers/genres.controller");

router.get('/', genres.list);
router.post('/', validate(rules.fields), genres.create);
router.get('/:genreId', validate(rules.byId), genres.get);
router.put('/:genreId', validate(rules.edit), genres.update);
router.delete('/:genreId', validate(rules.byId), genres.remove);

module.exports = router;
