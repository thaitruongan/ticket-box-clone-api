const router = require("express").Router();
const uploadController = require("../controllers/upload-controller");
const upload = require("../middlewares/upload");
const Auth = require("../middlewares/auth");

/**
 * @swagger
 * /api/upload:
 *    post:
 *      summary: Upload a file
 *      tags:
 *        - Uploads
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *      responses:
 *        "200":
 *          description: Returns Url and Path
 *        "404":
 *          description: Server error
 */
router.post("/", upload, uploadController.uploadFile);

module.exports = router;
