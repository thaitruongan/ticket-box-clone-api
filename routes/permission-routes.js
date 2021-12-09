const router = require('express').Router()
const permissionController = require("../controllers/permission-controller");

router.post('/', permissionController.create);
router.delete('/:id',permissionController.delete);
router.get('/:id',permissionController.getById);
router.get('/',permissionController.list);

module.exports = router