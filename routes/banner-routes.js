const router = require('express').Router()
const bannerController = require("../controllers/banner-controllers");

router.post('/', bannerController.create);
router.put('/:id',bannerController.update);
router.delete('/:id',bannerController.delete);
router.get('/:id',bannerController.getById);
router.get('/',bannerController.list);

module.exports = router