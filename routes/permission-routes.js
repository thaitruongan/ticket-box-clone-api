const router = require('express').Router()
const permissionController = require("../controllers/permission-controller");
const Auth = require("../middlewares/auth");


router.post('/', Auth.authentication,permissionController.create);
router.delete('/:id',Auth.authentication,permissionController.delete);
router.get('/:id',Auth.authentication,permissionController.getById);
router.get('/',Auth.authentication,permissionController.list);

module.exports = router