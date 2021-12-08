const Router = require("express").Router();
const UserController = require("../controllers/user-controller");
const Auth = require("../middlewares/auth");

Router.get("/", UserController.List);
Router.post("/", UserController.LoginByPhone);
Router.post("/otp", UserController.VerifyOTP);
Router.put("/", UserController.Update);

module.exports = Router;
