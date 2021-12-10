const router = require('express').Router()
const seatController = require("../controllers/seat-controller");
const Auth = require("../middlewares/auth");


/**
 * @swagger
 * /api/seat/{id}:
 *    put:
 *      summary: Updates an existing seat
 *      produces:
 *        - application/json
 *      tags:
 *        - Seats
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true
 *        - in: path
 *          name: id
 *          description: seat ID
 *          type: string
 *          required: true
 *      requestBody:
 *        description: Data for seat
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                row:
 *                  type:string
 *                column:
 *                  type: number
 *                isVip:
 *                  type: boolean
 *                isAvailable:
 *                  type: boolean                 
 *              example:
 *                  isVip: true
 *                  isAvailable: false
 *      responses:
 *        "200":
 *          description: Returns updated seat
 *        "400":
 *          description: Seat not found
 */
router.put('/:id',Auth.authentication,seatController.update);

/**
 * @swagger
 * /api/seat/{id}:
 *    get:
 *      summary: Get an seat by ID
 *      produces:
 *        - application/json
 *      tags:
 *        - Seats
 *      parameters:        
 *        - in: path
 *          name: id
 *          description: Seat id
 *          type: string
 *          required: true
 *      responses:
 *        "200":
 *          description: Returns a an seat along with its data
 *        "404":
 *          description: Seat not found
 */
router.get('/:id',Auth.authentication,seatController.getById);

/**
 * @swagger
 * /api/seat:
 *    get:
 *      summary: Get all seat
 *      produces:
 *        - application/json
 *      tags:
 *        - Seats
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true
 *      responses:
 *        "200":
 *          description: Returns a list of all seat
 *
 */
router.get('/',Auth.authentication,seatController.list);

module.exports = router