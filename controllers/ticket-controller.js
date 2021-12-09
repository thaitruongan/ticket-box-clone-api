const TicketModel = require("../models/tickets-model");
const SeatModel = require("../models/seat-model");
const mongoose = require("mongoose");

const TicketController = {
  async Create(showtimeId, roomId, userId) {
    try {
      const seats = await SeatModel.find({ roomId: roomId });

      for (let i = 0; i < seats.length; i++) {
        const ticket = new TicketModel({
          seatId: mongoose.Types.ObjectId(seats[i]._id),
          showtimeId: mongoose.Types.ObjectId(showtimeId),
          userId: mongoose.Types.ObjectId(userId),
        });

        await ticket.save();
      }

      const tickets = await TicketModel.find({ showtimeId: showtimeId });
      return Promise.resolve(ticket);
      //   res.status(200).json({ message: "successfully!", data: tickets });
    } catch (error) {
      //   res.status(400).json({ message: "failure", error: error.message });
      return Promise.reject(error);
    }
  },
};

module.exports = TicketController;
