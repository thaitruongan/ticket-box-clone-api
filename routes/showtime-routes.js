const Router = require("express").Router();
const Auth = require("../middlewares/auth");
const ShowtimeController = require("../controllers/showtime-controller");

/**
 * @swagger
 * /api/showtime:
 *    get:
 *      summary: Get all showtime
 *      produces:
 *        - application/json
 *      tags:
 *        - Showtimes
 *      responses:
 *        "200":
 *          description: Returns a list of all showtime
 *
 */
Router.get("/", ShowtimeController.List);

/**
 * @swagger
 * /api/showtime/{id}:
 *    get:
 *      summary: Get an showtime by ID
 *      produces:
 *        - application/json
 *      tags:
 *        - Showtimes
 *      responses:
 *        "200":
 *          description: Returns a an showtime along with its data
 *        "404":
 *          description: Showtime not found
 */
Router.get("/:id", ShowtimeController.GetById);

/**
 * @swagger
 * /api/showtime:
 *    post:
 *      summary: Creates a new showtime  
 *      produces:
 *        - application/json
 *      tags:
 *        - Showtimes
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true
 *      requestBody:
 *        description: Data for new showtime
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                movieId:
 *                  type: string
 *                timeStart:
 *                  type: date
 *                roomId:
 *                  type: string
 *                standardPrice:
 *                  type: number
 *                vipPrice:
 *                  type: number                   
 *              example:
 *                  movieId: 61aedafbc5c70c6293511675
 *                  timeStart: 10-12-2021
 *                  roomId: 61b2d0135b2065af8e65c4f7
 *                  standardPrice: 30000
 *                  vipPrice: 50000     
 *      responses:
 *        "200":
 *          description: Returns created show time
 *        "400":
 *          description: Server error
 */
Router.post("/", Auth.authentication,Auth.authorization({ permission: "Superuser", collectionName: "*" }), ShowtimeController.Create);

module.exports = Router;
