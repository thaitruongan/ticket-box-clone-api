const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoomSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Room name is require"],
  },
  rowAmount: {
    type: Number,
    required: [true, "Row amount is require"],
    validate: {
      validator: function (c) {
        return c > 0;
      },
      message: (props) => `${props.value} must be more than 0`,
    },
  },
  columnAmount: {
    type: Number,
    required: [true, "Column amount is require"],
    validate: {
      validator: function (c) {
        return c > 0;
      },
      message: (props) => `${props.value} must be more than 0`,
    },
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

module.exports = mongoose.model("Room", RoomSchema);
