const UserModel = require("../models/user-model");
const { CacheController } = require("../controllers/cache-controller");
const sendOTP = require("./sendOTP");
const jwt = require("jsonwebtoken");

const otpCache = new CacheController(300);

const userController = {
  async LoginByPhone(req, res) {
    const { phoneNumber } = req.body;
    const user = await UserModel.findOne({
      phoneNumber: phoneNumber,
    });
    //register
    if (user === null) return UserController.register(phoneNumber, res);

    if (user.activate !== "activated")
      return res.status(400).json({ message: "Active your account first" });
    const userId = user._id.toString();
    const randomString = sendOTP.randomCode(4);
    try {
      await sendOTP.sendOTP(randomString, phoneNumber);
      otpCache.set(`otp${userId}`, randomString);
      console.log(otpCache.request(`otp${userId}`));
      return res
        .status(200)
        .json({ message: "success!", data: "cho nhap cai otp" });
    } catch (error) {
      return res.status(400).json({ message: "failure!", data: error.message });
    }
  },

  async register(phone, res) {
    const randomString = sendOTP.randomCode(4);
    const randomId = sendOTP.randomCode(15);
    try {
      await sendOTP.sendOTP(randomString, phoneNumber);
      otpCache.set(`otp${randomId}`, randomString);
      console.log(otpCache.request(`otp${userId}`));
      return res
        .status(200)
        .json({ message: "success!", data: "cho nhap cai otp" });
    } catch (error) {
      return res.status(400).json({ message: "failure!", data: error.message });
    }
  },

  async VerifyOTP(req, res) {
    const { otp, phoneNumber } = req.body;
    const user = await UserModel.findOne({ phoneNumber: phoneNumber });
    if (user === null)
      return res.status(400).json({ message: "user not found!" });

    const userId = user._id.toString();
    console.log(await otpCache.request(`otp${userId}`), "hihi");
    if (otp + "" !== (await otpCache.request(`otp${userId}`)))
      return res.status(400).json({ message: "OTP was expired!" });

    const token = userController.generateToken(userId, user.phoneNumber);
    otpCache.delete(`otp${userId}`);
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
