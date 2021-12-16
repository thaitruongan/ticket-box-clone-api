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

  tickets: {
    type: [Schema.Types.ObjectId],
    require: [true, "Tickets is require"],
  },

  totalPrice: Number,
});

module.exports = mongoose.model("bill", billSchema);
