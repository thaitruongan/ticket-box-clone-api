const mongoose = require("mongoose");
const { Schema } = mongoose;

const billSchema = new Schema({
  userId: {
    type: String,
    required: [true, "User id is required"],
  },

  createdDate: {
    type: Date,
    default: new Date(),
  },

  details: [
    {
      ticketId: String,
      price: number,
    },
  ],

  totalPrice: number,
});

module.exports = billSchema;
