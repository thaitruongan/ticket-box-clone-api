const UserModel = require("../models/user-model");
const { cache, CacheController } = require("../controllers/cache-controller");
const PermissionController = require("../controllers/permission-controller");
const sendOTP = require("./sendOTP");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const otpCache = new CacheController(300);

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
    let user = await UserModel.findOne({
      phoneNumber: phoneNumber,
    });
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
    console.log(req.body);
    try {
      const { otp, phoneNumber } = req.body;

      let user = await UserModel.findOne({ phoneNumber: phoneNumber });
      if (user === null) {
        user = new UserModel({ phoneNumber: phoneNumber });
        if (user === undefined)
          return res.status(400).json({ message: "Invalid OTP!" });

        console.log(await otpCache.request(`otp${phoneNumber}`), "hihi");
        if (otp + "" !== (await otpCache.request(`otp${phoneNumber}`)))
          return res
            .status(400)
            .json({ message: "OTP was expired or not true!" });
        user.save();
      } else {
        console.log(await otpCache.request(`otp${phoneNumber}`), "hihi");
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
        data: {
          name: user.name,
          sex: user.sex,
          avatar: user.avatar,
          birth: user.birth,
        },
      });
    } catch (error) {
      res.status(400).send({ message: "fail", error: error });
    }
  },

  async Update(req, res) {
    if (!req.user)
      return res.status(400).json({ message: "failure!", data: null });
    if (req.uploadData) req.body.image = req.uploadData.fileName;
    const { phoneNumber, email, name, birth, sex, avatar } = req.body;

    const user = await UserModel.findOne({
      _id: mongoose.Types.ObjectId(req.user.id),
      phoneNumber: phoneNumber,
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

      const user = await UserModel.findOne(mongoose.Types.ObjectId(id));

      if (!user)
        return res.status(400).json({
          message: "fail",
          error: new Error("User is not exists").message,
        });

      let version = user.version;
      req.body.updateBy = req.user.id;
      req.body.updatedAt = new Date();
      await UserModel.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        {
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
      res.status(400).json({ message: "fail", error: error.message });
    }
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
