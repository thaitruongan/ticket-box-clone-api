const Router = require("express").Router();
const UserController = require("../controllers/user-controller");
const Auth = require("../middlewares/auth");

/**
 * @swagger
 * /api/user:
 *    get:
 *      summary: Get all user
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true
 *      responses:
 *        "200":
 *          description: Returns a list of all user
 *
 */
Router.get("/", Auth.authentication,UserController.List);

/**
 * @swagger
 * /api/user:
 *    post:
 *      summary: Login by phone number 
 *      produces:
 *        - application/json
 *      tags:
 *        - Users   
 *      requestBody:
 *        description: Phone number
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                phoneNumber:
 *                  type: string                  
 *              example:
 *                  phoneNumber: "0914518169"  
 *        responses:
 *         "200":
 *           description: Returns message success and sending OTP
 *         "400":
 *           description: Server error
 */
Router.post("/", UserController.LoginByPhone);

/**
 * @swagger
 * /api/user/otp:
 *    post:
 *      summary: Insert OTP 
 *      produces:
 *        - application/json
 *      tags:
 *        - Users   
 *      requestBody:
 *        description: OTP
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                phoneNumber:
 *                  type: string
 *                otp:
 *                  type: string                   
 *              example:
 *                  phoneNumber: "0914518169"  
 *                  otp: "2131"
 *        responses:
 *         "200":
 *           description: Returns message success, token, data user
 *         "400":
 *           description: Server error
 */
Router.post("/otp", UserController.VerifyOTP);

/**
 * @swagger
 * /api/user:
 *    put:
 *      summary: Personal user info
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
 *        description: Data for user
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type:string
 *                name:
 *                  type: string
 *                birth:
 *                  type: date
 *                sex:
 *                  type: string
 *                avatar:
 *                  type: string
 *                permission:
 *                  type: string          
 *              example:
 *                  email: ben.anthai99@gmail.com
 *                  name: Thái Trường An
 *                  birth: 12-31-1999
 *                  sex: male
 *                  avatar: thaitruongan.png
 *      responses:
 *        "200":
 *          description: Returns updated user
 */
Router.put("/", Auth.authentication,UserController.Update);

module.exports = Router;
