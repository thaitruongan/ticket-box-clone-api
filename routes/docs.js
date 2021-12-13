const express = require("express");
const router = express.Router();
const swagger = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Ticket Box Clone API",
      version: "1.0.0",
      description:
        "Backend API to manage Ticket Box Clone API",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/",
      },
    },
  },
  apis: [
    "./routes/user-routes.js",
    "./routes/banner-routes.js",
    "./routes/movie-routes.js",
    "./routes/permission-routes.js",
    "./routes/room-routes.js",
    "./routes/seat-routes.js",
    "./routes/showtime-routes.js",
    "./routes/ticket-routes.js"
],
};
const specs = swagger(swaggerOptions);
router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(specs, {
    explorer: true,
  })
);
module.exports = router;