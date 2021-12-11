const Router = require("express").Router();
const TicketController = require("../controllers/ticket-controller");

Router.get("/:id", TicketController.GetByShowtimeId);

module.exports = Router;
