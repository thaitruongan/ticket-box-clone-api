const router = require('express').Router()
const bannerController = require("../controllers/banner-controller");
const Auth = require("../middlewares/auth");

router.post('/',Auth.authentication ,bannerController.create);
router.put('/:id',Auth.authentication,bannerController.update);
router.delete('/:id',Auth.authentication,bannerController.delete);
router.get('/:id',bannerController.getById);
router.get('/',bannerController.list);

module.exports = router