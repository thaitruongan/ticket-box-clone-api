const mongoose = require("mongoose");
const { Schema } = mongoose;

const SeatSchema = new Schema({
  row: {
    type: String,
    required: [true, "Row is require"],
  },
  column: {
    type: Number,
    required: [true, "Column is require"],
    validate: {
      validator: function (c) {
        return c >= 0;
      },
      message: (props) => `${props.value} must be greater than 0`,
    },
  },
  isVip: {
    type: Boolean,
    default: "false",
  },
  isAvailable: {
    type: Boolean,
    default: "true",
  },
  roomId: {
    type: Schema.Types.ObjectId,
    required: [true, "RoomId is require"],
  },
  createBy: {
    type: Schema.Types.ObjectId,
    default: null,
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
  isAlive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Seat", SeatSchema);
