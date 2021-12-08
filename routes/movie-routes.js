const router = require('express').Router()
const movieController = require("../controllers/movie-controller");

router.post('/', movieController.create);
router.put('/:id',movieController.update);
router.delete('/:id',movieController.delete);
router.get('/:id',movieController.getById);
router.get('/',movieController.list);
router.post('/search',movieController.search)

module.exports = router