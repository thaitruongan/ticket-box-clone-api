const mongoose = require("mongoose");
const { Schema } = mongoose;

const billSchema = new Schema({
  userId: {
    type: String,
    required: [true, "User id is required"],
  },

  phoneNumber: {
    type: Number,
    required: [true, "Phone number is required"],
  },

  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Email not valid",
    ],
    required: [true, "email is required"],
  },

  createdDate: {
    type: Date,
    default: new Date(),
  },

  tickets: {
    type: [Schema.Types.ObjectId],
    require: [true, "Tickets is require"],
  },

  totalPrice: Number,
});

module.exports = mongoose.model("bill", billSchema);
