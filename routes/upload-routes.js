const router = require('express').Router()
const uploadController = require('../controllers/upload-controller')
const upload = require('../middlewares/upload')

router.post('/', uploadController.uploadFile)

module.exports = router