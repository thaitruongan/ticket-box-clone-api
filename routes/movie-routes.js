const router = require("express").Router();
const movieController = require("../controllers/movie-controller");
const Auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");

/**
 * @swagger
 * /api/movie:
 *    post:
 *      summary: Creates a new movie
 *      produces:
 *        - application/json
 *      tags:
 *        - Movies
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true
 *      requestBody:
 *        description: Data for new movie
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *                name:
 *                  type:strings
 *                trailer:
 *                  type: string
 *                description:
 *                  type: string
 *                label:
 *                  type: string
 *                runningTime:
 *                  type: number
 *                releaseDate:
 *                  type: date
 *              example:
 *                name: SHANG-CHI AND THE LEGEND OF THE TEN RINGS
 *                trailer: hihi.mp4
 *                description: hihi
 *                label: C13
 *                runningTime: 90
 *                releaseDate: 10-12-2021
 *        responses:
 *         "200":
 *           description: Returns created movie
 *         "400":
 *           description: Server error
 */
router.post("/", Auth.authentication, upload, movieController.create);

/**
 * @swagger
 * /api/movie/{id}:
 *    put:
 *      summary: Updates an existing movie
 *      produces:
 *        - application/json
 *      tags:
 *        - Movies
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true
 *        - in: path
 *          name: id
 *          description: movie ID
 *          type: string
 *          required: true
 *      requestBody:
 *        description: Data for movie
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *                name:
 *                  type:string
 *                trailer:
 *                  type: string
 *                description:
 *                  type: string
 *                label:
 *                  type: string
 *                runningTime:
 *                  type: number
 *                releaseDate:
 *                  type: date
 *              example:
 *                name: SHANG-CHI AND THE LEGEND OF THE TEN RINGS
 *      responses:
 *        "200":
 *          description: Returns updated movie
 *        "400":
 *          description: Movie not found
 */
router.put("/:id", Auth.authentication, upload, movieController.update);

/**
 * @swagger
 * /api/movie/{id}:
 *    delete:
 *      summary: Deletes an individual movie
 *      produces:
 *        - application/json
 *      tags:
 *        - Movies
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true
 *        - in: path
 *          name: id
 *          description: Movie ID to delete
 *          type: string
 *          required: true
 *      responses:
 *        "200":
 *          description: Movie deleted
 *        "404":
 *          description: Movie not found
 *
 */
router.delete("/:id", Auth.authentication, movieController.delete);

/**
 * @swagger
 * /api/movie/{id}:
 *    get:
 *      summary: Get an movie by ID
 *      produces:
 *        - application/json
 *      tags:
 *        - Movies
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Movie id
 *          type: string
 *          required: true
 *      responses:
 *        "200":
 *          description: Returns a an movie along with its data
 *        "404":
 *          description: Movie not found
 */
router.get("/:id", movieController.getById);

/**
 * @swagger
 * /api/movie:
 *    get:
 *      summary: Get all movie
 *      produces:
 *        - application/json
 *      tags:
 *        - Movies
 *      responses:
 *        "200":
 *          description: Returns a list of all movie
 *
 */
router.get("/", movieController.list);

router.post("/search", movieController.search);
/**
 * @swagger
 * /api/movie/search:
 *    post:
 *      summary: Search an existing movie
 *      produces:
 *        - application/json
 *      tags:
 *        - Movies
 *      requestBody:
 *        description: Data for search
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type:string
 *              example:
 *                name: SHANG-CHI
 *      responses:
 *        "200":
 *          description: Return movies
 *        "400":
 *          description: Server error
 */
module.exports = router;
