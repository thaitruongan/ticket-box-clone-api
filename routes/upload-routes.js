const router = require('express').Router()
const uploadController = require('../controllers/upload-controller')
const upload = require('../middlewares/upload')
const Auth = require("../middlewares/auth");
router.post('/', Auth.authentication,uploadController.uploadFile)

module.exports = router