const Router = require("express").Router();
const UserController = require("../controllers/user-controller");
const Auth = require("../middlewares/auth");

Router.get("/", Auth.authentication,UserController.List);
Router.post("/", UserController.LoginByPhone);
Router.post("/otp", UserController.VerifyOTP);
Router.put("/", Auth.authentication,UserController.Update);

module.exports = Router;
