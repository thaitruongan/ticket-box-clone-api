const jwt = require("jsonwebtoken");
const { cache } = require("../controllers/cache-controller");
const UserController = require("../controllers/user-controller");
const UserModel = require("../models/user-model");
const mongoose = require("mongoose");

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
  authorization(permission) {
    return function (req, res, next) {
      const userId = req.user.id;
      UserModel.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: "permissions",
            localField: "permission",
            foreignField: "_id",
            as: "permissions",
          },
        },
      ])
        .then((user) => {
          console.log(user);
          console.log(user[0].permissions, permission);
          if (user.length === 0 || user[0].permissions.length === 0)
            return res
              .status(400)
              .send("You have no permissions to access this");

          for (let i = 0; i < user[0].permissions.length; i++) {
            if (
              user[0].permissions[i].permission === permission.permission &&
              user[0].permissions[i].collectionName ===
                permission.collectionName
            )
              return next();
          }

          return res.status(400).json({
            message: "fail",
            error: new Error("You have no permissions to access this").message,
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(400).json({
            message: "fail",
            error: error.message,
          });
        });
    };
  },
};

module.exports = Auth;
