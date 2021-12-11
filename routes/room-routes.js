const router = require('express').Router()
const roomController = require("../controllers/room-controller");
const Auth = require("../middlewares/auth");

/**
 * @swagger
 * /api/room:
 *    post:
 *      summary: Creates a new room  
 *      produces:
 *        - application/json
 *      tags:
 *        - Rooms
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true
 *      requestBody:
 *        description: Data for new room
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type:string
 *                rowAmount:
 *                  type: number
 *                columnAmount:
 *                  type: number               
 *              example:
 *                name: CineStar Num Bếu
 *                rowAmount: 2
 *                columnAmount: 10     
 *        responses:
 *         "200":
 *           description: Returns created room
 *         "400":
 *           description: Server error
 */
router.post('/', Auth.authentication,roomController.create);

/**
 * @swagger
 * /api/room/{id}:
 *    put:
 *      summary: Updates an existing movie
 *      produces:
 *        - application/json
 *      tags:
 *        - Rooms
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true
 *        - in: path
 *          name: id
 *          description: room ID
 *          type: string
 *          required: true
 *      requestBody:
 *        description: Data for room
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type:string
 *                rowAmount:
 *                  type: number
 *                columnAmount:
 *                  type: number               
 *              example:
 *                name: CineStar Num Bếu
 *                rowAmount: 2
 *                columnAmount: 10
 *      responses:
 *        "200":
 *          description: Returns updated room
 *        "400":
 *          description: Room not found
 */
router.put('/:id',Auth.authentication,roomController.update);

/**
 * @swagger
 * /api/room/{id}:
 *    delete:
 *      summary: Deletes an individual room
 *      produces:
 *        - application/json
 *      tags:
 *        - Rooms
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true
 *        - in: path
 *          name: id
 *          description: Room ID to delete
 *          type: string
 *          required: true
 *      responses:
 *        "200":
 *          description: Room deleted
 *        "404":
 *          description: Room not found
 *          
 */
router.delete('/:id',Auth.authentication,roomController.delete);

/**
 * @swagger
 * /api/room/{id}:
 *    get:
 *      summary: Get an room by ID
 *      produces:
 *        - application/json
 *      tags:
 *        - Rooms
 *      parameters:        
 *        - in: path
 *          name: id
 *          description: Room id
 *          type: string
 *          required: true
 *      responses:
 *        "200":
 *          description: Returns a an room along with its data
 *        "404":
 *          description: Room not found
 */
router.get('/:id',Auth.authentication,roomController.getById);

/**
 * @swagger
 * /api/room:
 *    get:
 *      summary: Get all room
 *      produces:
 *        - application/json
 *      tags:
 *        - Rooms
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true
 *      responses:
 *        "200":
 *          description: Returns a list of all room
 *
 */
router.get('/',Auth.authentication,roomController.list);

module.exports = router