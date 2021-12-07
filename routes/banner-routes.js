const router = require('express').Router()
const postController = require("../controllers/banner-controllers");

router.post('/', postController.create);
router.put('/:id',postController.update);
router.delete('/:id',postController.delete);
router.get('/:id',postController.getById);
router.get('/',postController.list);

module.exports = router