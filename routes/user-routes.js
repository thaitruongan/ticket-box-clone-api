const Router = require("express").Router();
const UserController = require("../controllers/user-controller");
const Auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");

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
Router.get(
  "/",
  Auth.authentication,
  Auth.authorization({ permission: "Superuser", collectionName: "*" }),
  UserController.List
);

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
 *      responses:
 *        "200":
 *          description: Returns message success and sending OTP
 *        "400":
 *          description: Server error
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
 *      responses:
 *        "200":
 *           description: Returns message success, token, data user
 *        "400":
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
 *        - Users
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
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *                email:
 *                  type: string
 *                name:
 *                  type: string
 *                birth:
 *                  type: date
 *                sex:
 *                  type: string
 *      responses:
 *        "200":
 *          description: Returns updated user
 */
Router.put("/", Auth.authentication, upload, UserController.Update);

/**
 * @swagger
 * /api/user/grant-permission:
 *    put:
 *      summary: Grant permission
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
 *      requestBody:
 *        description: Grant data for user
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                permissions:
 *                  type: array
 *                id:
 *                  type: string
 *              example:
 *                permissions: []
 *                id: ""
 *      responses:
 *        "200":
 *          description: Returns updated grant user
 */
Router.put(
  "/grant-permission",
  Auth.authentication,
  UserController.GrantPermission
);

Router.get("/verify", Auth.authentication, UserController.VerifyToken);

Router.post("/google", UserController.GoogleLogin);

Router.post("/facebook", UserController.FacebookLogin);

module.exports = Router;
