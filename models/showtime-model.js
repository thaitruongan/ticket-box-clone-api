const mongoose = require("mongoose");
const { Schema } = mongoose;

const ShowtimeSchema = new Schema({
  movieId: {
    type: Schema.Types.ObjectId,
    required: [true, "movies is required"],
  },
  timeStart: {
    type: Date,
    required: [true, "time is required"],
  },
  roomId: {
    type: Schema.Types.ObjectId,
    required: [true, "room is required"],
  },
  standardPrice: {
    type: Number,
    required: [true, "standard price is required"],
    validate: {
      validator: function (sP) {
        return sP > 0;
      },
      message: (props) => `${props.value} must be greater than zero`,
    },
  },
  vipPrice: {
    type: Number,
    required: [true, "vip price is required"],
    validate: {
      validator: function (vP) {
        return vP > 0;
      },
      message: (props) => `${props.value} must be greater than zero`,
    },
  },
  createBy: {
    type: Schema.Types.ObjectId,
    required: [true, "Author of this showtime is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updateBy: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  updatedAt: {
    type: Date,
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
});

module.exports = mongoose.model("showtime", ShowtimeSchema);
