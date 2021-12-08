const Router = require("express").Router();
const UserController = require("../controllers/user-controller");

Router.post("/", UserController.LoginByPhone);
Router.post("/otp", UserController.VerifyOTP);

module.exports = Router;
