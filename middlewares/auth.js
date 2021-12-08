const jwt = require("jsonwebtoken");
const { cache } = require("../controllers/cache-controller");

const Auth = {
  async authentication(req, res, next) {
    const token = req.headers["tbtoken"];

    if (!token) return res.status(401).send("Access denied!");

    try {
      req.user = jwt.verify(token, "tta");
      console.log("token", await cache.request(`user${req.user.phone}`));
      const result = await cache.request(`user${req.user.phone}`);
      if (result !== null) {
        if (token === result) {
          next();
        } else {
          res.status(400).send("session expired");
        }
      } else {
        res.status(400).send("session expired");
      }
    } catch (error) {
      console.log(error);
      res.status(400).send("Session expired");
    }
  },
};

module.exports = Auth;
