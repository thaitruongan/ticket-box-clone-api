const router = require('express').Router()
const permissionController = require("../controllers/permission-controller");
const Auth = require("../middlewares/auth");

/**
 * @swagger
 * /api/permission:
 *    post:
 *      summary: Creates a new permission  
 *      produces:
 *        - application/json
 *      tags:
 *        - Permissions
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true
 *      requestBody:
 *        description: Data for new permission
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                permission:
 *                  type:string
 *                collectionName:
 *                  type: string                          
 *              example:
 *                permission: Admin
 *                collectionName: movie                   
 *        responses:
 *         "200":
 *           description: Returns created permission
 *         "400":
 *           description: Server error
 */
router.post('/', Auth.authentication,permissionController.create);

/**
 * @swagger
 * /api/permission/{id}:
 *    delete:
 *      summary: Deletes an individual permission
 *      produces:
 *        - application/json
 *      tags:
 *        - Permissions
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true
 *        - in: path
 *          name: id
 *          description: Permission ID to delete
 *          type: string
 *          required: true
 *      responses:
 *        "200":
 *          description: Permission deleted
 *        "404":
 *          description: Permission not found
 *          
 */
router.delete('/:id',Auth.authentication,permissionController.delete);

/**
 * @swagger
 * /api/permission/{id}:
 *    get:
 *      summary: Get an permission by ID
 *      produces:
 *        - application/json
 *      tags:
 *        - Permissions
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true        
 *        - in: path
 *          name: id
 *          description: Permission id
 *          type: string
 *          required: true
 *      responses:
 *        "200":
 *          description: Returns a an permission along with its data
 *        "404":
 *          description: Permission not found
 */
router.get('/:id',Auth.authentication,permissionController.getById);

/**
 * @swagger
 * /api/permission:
 *    get:
 *      summary: Get all permission
 *      produces:
 *        - application/json
 *      tags:
 *        - Permissions
 *      parameters:
 *        - in: header
 *          name: tbtoken
 *          description: Token authentication
 *          type: string
 *          required: true
 *      responses:
 *        "200":
 *          description: Returns a list of all permission
 *
 */
router.get('/',Auth.authentication,permissionController.list);

module.exports = router