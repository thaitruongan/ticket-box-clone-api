const UserModel = require("../models/user-model");
const { cache, CacheController } = require("../controllers/cache-controller");
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
        .json({ message: "success!", data: "cho nhap cai otp" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "failure!", data: error.message });
    }
  },

  async VerifyOTP(req, res) {
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
  },

  async Update(req, res) {
    if (!req.user)
      return res.status(400).json({ message: "failure!", data: null });
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
      updatedBy: req.user.id,
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
