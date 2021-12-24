const router = require("express").Router();
const BillController = require("../controllers/bill-controller");
const Auth = require("../middlewares/auth");

/**
 * @swagger
 * /api/payment:
 *    post:
 *      summary: Creates a new payment
 *      produces:
 *        - application/json
 *      tags:
 *        - Payment
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true
 *      requestBody:
 *        description: Data for new payment
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type:string
 *                createDate:
 *                  type: date
 *                tickets:
 *                  type: array
 *                totalPrice:
 *                  type: number
 *              example:
 *                userId: ""
 *                tickets: []
 *                totalPrice: 300000
 *      responses:
 *        "200":
 *          description: Returns created payment
 *        "400":
 *          description: Server error
 */
router.post("/", Auth.authentication, BillController.Payment);

router.get("/", Auth.authentication, BillController.Get);

module.exports = router;
