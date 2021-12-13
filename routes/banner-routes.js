const router = require("express").Router();
const bannerController = require("../controllers/banner-controller");
const Auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");

/**
 * @swagger
 * /api/banner:
 *    post:
 *      summary: Creates a new banner
 *      produces:
 *        - application/json
 *      tags:
 *        - Banners
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true
 *      requestBody:
 *        description: Data for new banner
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *                movieId:
 *                  type: string
 *              example:
 *                movieId: 61ada1b13dcf152655396e6c
 *      responses:
 *        "200":
 *          description: Returns created banner
 *        "400":
 *          description: Server error
 */
router.post("/", Auth.authentication,Auth.authorization({ permission: "Superuser", collectionName: "*" }), upload, bannerController.create);

/**
 * @swagger
 * /api/banner/{id}:
 *    put:
 *      summary: Updates an existing banner
 *      produces:
 *        - application/json
 *      tags:
 *        - Banners
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true
 *        - in: path
 *          name: id
 *          description: banner ID
 *          type: string
 *          required: true
 *      requestBody:
 *        description: Data for new banner
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *                movieId:
 *                  type: string
 *              example:
 *                movieId: 61ada1b13dcf152655396e6c
 *      responses:
 *        "200":
 *          description: Returns updated banner
 *        "400":
 *          description: Banner not found
 */
router.put("/:id", Auth.authentication, upload,Auth.authorization({ permission: "Superuser", collectionName: "*" }), bannerController.update);

/**
 * @swagger
 * /api/banner/{id}:
 *    get:
 *      summary: Get an banner by ID
 *      produces:
 *        - application/json
 *      tags:
 *        - Banners
 *      parameters:
 *        - in: path
 *          name: id
 *          description: banner id
 *          type: string
 *          required: true
 *      responses:
 *        "200":
 *          description: Returns a an banner along with its data
 *        "404":
 *          description: Banner not found
 */
router.get("/:id", bannerController.getById);

/**
 * @swagger
 * /api/banner:
 *    get:
 *      summary: Get all banner
 *      produces:
 *        - application/json
 *      tags:
 *        - Banners
 *      responses:
 *        "200":
 *          description: Returns a list of all banner
 *
 */
router.get("/", bannerController.list);

module.exports = router;
