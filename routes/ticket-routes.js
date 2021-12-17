const Router = require("express").Router();
const Auth = require("../middlewares/auth");
const TicketController = require("../controllers/ticket-controller");

// /**
//  * @swagger
//  * /api/ticket/{id}:
//  *    get:
//  *      summary: Get an ticket by showtime Id
//  *      produces:
//  *        - application/json
//  *      tags:
//  *        - Tickets
//  *      parameters:
//  *        - in: path
//  *          name: id
//  *          description: Showtime id
//  *          type: string
//  *          required: true
//  *      responses:
//  *        "200":
//  *          description: Returns a an ticket along with its showtime
//  *        "404":
//  *          description: Showtime not found
//  */
// Router.get("/:id", TicketController.GetByShowtimeId);

Router.post(
  "/change-ticket-status",
  Auth.authentication,
  TicketController.ChangeStatusRoute
);

module.exports = Router;
