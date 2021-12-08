const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  phoneNumber: {
    type: String,
    unique: true,
    match: [
      /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
      "Phone number is not valid",
    ],
    required: [true, "Phone number is required"],
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Email not valid",
    ],
  },

  name: {
    type: String,
    maxlength: 50,
  },

  birth: {
    type: Date,
  },

  sex: {
    type: String,
    default: "male",
    enum: ["male", "female"],
  },

  avatar: {
    type: String,
    default: "default.png",
  },

  permission: {
    type: [Schema.Types.ObjectId],
    default: [],
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },

  updatedAt: {
    type: Date,
    default: null,
  },

  updateBy: {
    type: Schema.Types.ObjectId,
    default: null,
  },

  version: {
    type: Number,
    default: 0,
  },

  oldVersion: {
    type: [],
    default: [],
  },

  facebook: {
    type: {},
    default: {},
  },

  google: {
    type: {},
    default: {},
  },

  activityLogs: {
    type: [
      {
        time: Date,
        log: String,
      },
    ],

    default: [
      {
        time: new Date(),
        log: "Account was created",
      },
    ],
  },
});

module.exports = mongoose.model("User", UserSchema);
