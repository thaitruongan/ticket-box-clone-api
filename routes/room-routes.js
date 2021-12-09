const router = require('express').Router()
const roomController = require("../controllers/room-controller");
const Auth = require("../middlewares/auth");

router.post('/', Auth.authentication,roomController.create);
router.put('/:id',Auth.authentication,roomController.update);
router.delete('/:id',Auth.authentication,roomController.delete);
router.get('/:id',Auth.authentication,roomController.getById);
router.get('/',Auth.authentication,roomController.list);

module.exports = router