const router = require('express').Router()
const roomController = require("../controllers/room-controller");

router.post('/', roomController.create);
router.put('/:id',roomController.update);
router.delete('/:id',roomController.delete);
router.get('/:id',roomController.getById);
router.get('/',roomController.list);

module.exports = router