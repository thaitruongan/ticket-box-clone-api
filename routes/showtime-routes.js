const Router = require("express").Router();
const Auth = require("../middlewares/auth");
const ShowtimeController = require("../controllers/showtime-controller");

Router.get("/", ShowtimeController.List);
Router.get("/:id", ShowtimeController.GetById);
Router.post("/", Auth.authentication, ShowtimeController.Create);

module.exports = Router;
