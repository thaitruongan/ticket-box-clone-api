const router = require('express').Router()
const movieController = require("../controllers/movie-controller");
const Auth = require("../middlewares/auth");

router.post('/', Auth.authentication, movieController.create);
router.put('/:id',Auth.authentication,movieController.update);
router.delete('/:id',Auth.authentication,movieController.delete);
router.get('/:id',movieController.getById);
router.get('/',movieController.list);
router.post('/search',movieController.search)

module.exports = router