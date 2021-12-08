const router = require('express').Router()
const seatController = require("../controllers/seat-controller");

router.post('/', seatController.create);
router.put('/:id',seatController.update);
router.delete('/:id',seatController.delete);
router.get('/:id',seatController.getById);
router.get('/',seatController.list);

module.exports = router