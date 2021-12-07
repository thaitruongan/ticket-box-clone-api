const mongoose = require("mongoose");
const { Schema } = mongoose;

const TicketSchema = new Schema({
  seatId: {
    type: Schema.Types.ObjectId,
    required: [true, "Seat id is required"],
  },
  showtimeId: {
    type: Schema.Types.ObjectId,
    required: [true, "Show time id is required"],
  },
  status: {
    type: String,
    required: [true, "Status is required"],
  },
  userId: {
    type: Schema.Types.ObjectId,
    default: null,
  },
});

module.export = mongoose.model("Ticket", TicketSchema);
