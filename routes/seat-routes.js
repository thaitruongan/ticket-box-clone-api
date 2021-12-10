const router = require('express').Router()
const seatController = require("../controllers/seat-controller");
const Auth = require("../middlewares/auth");

router.post('/', Auth.authentication,seatController.create);
router.put('/:id',Auth.authentication,seatController.update);
router.get('/:id',Auth.authentication,seatController.getById);
router.get('/',Auth.authentication,seatController.list);

module.exports = router