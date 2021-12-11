const router = require("express").Router();
const bannerController = require("../controllers/banner-controller");
const Auth = require("../middlewares/auth");


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
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                image:
 *                  type: string
 *                movieId:
 *                  type: string
 *                order:
 *                  type: number
 *              example:
 *                image: x.png
 *                movieId: 61ada1b13dcf152655396e6c
 *                order: 1
 *      responses:
 *        "200":
 *          description: Returns created banner
 *        "400":
 *          description: Server error
 */
router.post("/", Auth.authentication, bannerController.create);

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
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                image:
 *                  type: string
 *                movieId:
 *                  type: string
 *                order:
 *                  type: number
 *              example:
 *                image: x.png
 *      responses:
 *        "200":
 *          description: Returns updated banner
 *        "400":
 *          description: Banner not found
 */
router.put("/:id", Auth.authentication, bannerController.update);

/**
 * @swagger
 * /api/banner/{id}:
 *    delete:
 *      summary: Deletes an individual banner
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
 *          description: Banner ID to delete
 *          type: string
 *          required: true
 *      responses:
 *        "200":
 *          description: Banner deleted
 *        "404":
 *          description: Banner not found
 *          
 */
router.delete("/:id", Auth.authentication, bannerController.delete);

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
