const UserModel = require("../models/user-model");
const { cache, CacheController } = require("../controllers/cache-controller");
const PermissionController = require("../controllers/permission-controller");
const sendOTP = require("./sendOTP");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "408075301782-j39rulkr2te17lttl2fp29pigqq1u3qt.apps.googleusercontent.com"
);

const otpCache = new CacheController(300);

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience:
      "408075301782-j39rulkr2te17lttl2fp29pigqq1u3qt.apps.googleusercontent.com", // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload["sub"];

  return Promise.resolve(payload);
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}

const userController = {
  async List(req, res) {
    try {
      let users = await cache.request(`list-user`);
      if (!users) {
        users = await UserModel.find();
        console.log(typeof users);
        cache.set(`list-user`, JSON.stringify(users));
        return res.status(200).json({ message: "successfully!", data: users });
      }
      res
        .status(200)
        .json({ message: "successfully!", data: JSON.parse(users) });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "failure!", data: error.message });
    }
  },

  async LoginByPhone(req, res) {
    const { phoneNumber } = req.body;

    //register
    const randomString = sendOTP.randomCode(4);
    try {
      await sendOTP.sendOTP(randomString, phoneNumber);
      otpCache.set(`otp${phoneNumber}`, randomString);
      console.log(otpCache.request(`otp${phoneNumber}`));
      return res
        .status(200)
        .json({ message: "success!", data: "Sending OTP..." });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "failure!", data: error.message });
    }
  },

  async VerifyOTP(req, res) {
    try {
      const { otp, phoneNumber } = req.body;

      let user = await UserModel.findOne({ phoneNumber: phoneNumber });

      //if (user is not exists => create new user)
      if (user === null) {
        if (req.body.facebook) {
          //create facebook account
          user = new UserModel({
            phoneNumber: phoneNumber,
            "facebook.id": req.body.facebook.id,
            name: req.body.facebook.name,
          });
        } else if (req.body.google) {
          //create google account
          const payload = await verify(req.body.google);

          user = new UserModel({
            phoneNumber: phoneNumber,
            "google.id": payload.sub,
            "google.email": payload.email,
            avatar: payload.picture,
            name: payload.name,
            email: payload.email,
          });
        } else {
          //create account by phone-number
          user = new UserModel({ phoneNumber: phoneNumber });
        }
        // if (user === undefined)
        //   return res.status(400).json({ message: "Invalid OTP!" });
        if (otp + "" !== (await otpCache.request(`otp${phoneNumber}`)))
          return res
            .status(400)
            .json({ message: "OTP was expired or not true!" });
        user.save();
      } else {
        // Check account is connect to facebook || google, if not, update connect
        if (req.body.facebook) {
          //check && update
          if (user.facebook.id === "") {
            await user.update({
              "facebook.id": req.body.facebook.id,
              name: req.body.facebook.name,
            });

            user = await UserModel.findOne({
              phoneNumber: req.body.phoneNumber,
            });
          } else if (user.facebook.id !== req.body.id) {
            return res.status(400).json({
              message: "fail",
              data: new Error("Phone number not match!").message,
            });
          }
        } else if (req.body.google) {
          let payload = await verify(req.body.google);
          if (user.google.id === "") {
            console.log("update google", payload);
            await user.update({
              "google.id": payload.sub,
              "google.email": payload.email,
              avatar: payload.picture,
              name: payload.name,
              email: payload.email,
            });
            user = await UserModel.findOne({
              phoneNumber: req.body.phoneNumber,
            });
          } else {
            if (user.google.id !== payload.sub)
              return res.status(400).json({
                message: "fail",
                data: new Error("Phone number not match!").message,
              });
          }
        }
        console.log(await otpCache.request(`otp${phoneNumber}`));
        if (otp + "" !== (await otpCache.request(`otp${phoneNumber}`)))
          return res.status(400).json({ message: "OTP was expired!" });
      }
      if (!user.isAlive)
        return res.status(400).json({ message: "You got banned", data: null });

      const userId = user._id.toString();
      console.log(userId, user.phoneNumber);
      const token = userController.generateToken(userId, user.phoneNumber);
      otpCache.delete(`otp${phoneNumber}`);
      cache.set(`user${phoneNumber}`, token);
      res.status(200).json({
        message: "success!",
        token: token,
        user,
      });
    } catch (error) {
      res.status(400).send({ message: "fail", error: error });
    }
  },

  async Update(req, res) {
    if (!req.user)
      return res.status(400).json({ message: "failure!", data: null });
    if (req.uploadData) req.body.avatar = req.uploadData.fileName;
    const { email, name, birth, sex, avatar } = req.body;

    const user = await UserModel.findOne({
      _id: mongoose.Types.ObjectId(req.user.id),
    });
    if (user === null)
      return res.status(400).json({
        message: "failure!",
        data: "You have not permission to update this user",
      });
    let version = user.version;
    const update = {
      email: email,
      name: name,
      birth: new Date(birth),
      sex: sex,
      avatar: avatar,
      version: version + 1,
      updatedAt: new Date(),
      updatedBy: mongoose.Types.ObjectId,
      $push: {
        oldVersion: user,
      },
    };

    const updatedUser = await UserModel.findOneAndUpdate(
      { phoneNumber: phoneNumber },
      update,
      { new: true }
    );

    updatedUser = await UserModel.findOne({ phoneNumber: phoneNumber });

    console.log(updatedUser);
    cache.delete(`list-user`);
    res.status(200).json({
      message: "User update successfully!",
      data: {
        name: updatedUser.name,
        sex: updatedUser.sex,
        avatar: updatedUser.avatar,
        birth: updatedUser.birth,
      },
    });
  },

  async GrantPermission(req, res) {
    try {
      console.log(req.body);
      const { id, permissions } = req.body;
      console.log(id, permissions);

      permissions.forEach(async (permission) => {
        if (
          !(await PermissionController.isExists({
            _id: mongoose.Types.ObjectId(permission),
          }))
        )
          return res.status(400).json({
            message: "fail",
            error: new Error("Permission is not exists").message,
          });
      });
      const user = await UserModel.findOne({
        _id: mongoose.Types.ObjectId(id),
      });
      if (!user)
        return res.status(400).json({
          message: "fail",
          error: new Error("User is not exists").message,
        });

      let version = user.version;
      await UserModel.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        {
          $set: {
            updatedAt: new Date(),
            updateBy: req.user.id,
            version: version + 1,
          },
          $push: {
            oldVersion: user,
            permission: req.body.permissions,
          },
        },
        { new: true }
      );

      const updatedUser = await UserModel.findOne({
        _id: mongoose.Types.ObjectId(id),
      });

      res.status(200).json({ message: "success", data: updatedUser });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "fail", error: error.message });
    }
  },

  FacebookLogin: async (req, res) => {
    try {
      const user = await UserModel.findOne({
        "facebook.id": req.body.facebook.id,
      });
      if (!user) {
        return res.status(200).json({ status: "fail" });
      }
      const token = userController.generateToken(user._id, user.phoneNumber);
      cache.set(`user${user.phoneNumber}`, token);
      res.status(200).json({ status: "success", token: token, data: user });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  },

  GoogleLogin: async (req, res) => {
    try {
      const payload = await verify(req.body.google);
      const user = await UserModel.findOne({
        "google.id": payload.sub,
        "google.email": payload.email,
      });
      if (!user) {
        return res.status(200).json({ status: "fail" });
      }
      const token = userController.generateToken(user._id, user.phoneNumber);
      cache.set(`user${user.phoneNumber}`, token);
      res.status(200).json({ status: "success", token: token, data: user });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  },

  async VerifyToken(req, res) {
    if (!req.user) return res.status(400).json({ message: "Invalid token" });

    const user = await UserModel.findById(req.user.id);

    if (!user) return res.status(400).json({ message: "User not found" });

    res.status(200).json({ message: "success", data: user });
  },

  generateToken(id, phone) {
    return jwt.sign(
      {
        id: id,
        phone: phone,
      },
      "tta"
    );
  },
};

module.exports = userController;
