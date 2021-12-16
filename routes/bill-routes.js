const router = require("express").Router();
const BillController = require("../controllers/bill-controller");
const Auth = require("../middlewares/auth");

router.post("/", Auth.authentication, BillController.Payment);

module.exports = router;
