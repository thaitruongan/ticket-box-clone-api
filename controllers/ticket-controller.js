const TicketModel = require("../models/ticket-model");
const SeatModel = require("../models/seat-model");
const mongoose = require("mongoose");

const TicketController = {
  async Create(showtimeId, roomId) {
    try {
      const seats = await SeatModel.find({ roomId: roomId });

      for (let i = 0; i < seats.length; i++) {
        const ticket = new TicketModel({
          seatId: mongoose.Types.ObjectId(seats[i]._id),
          showtimeId: mongoose.Types.ObjectId(showtimeId),
        });

        await ticket.save();
      }

      const tickets = await TicketModel.find({ showtimeId: showtimeId });
      return Promise.resolve(tickets);
      //   res.status(200).json({ message: "successfully!", data: tickets });
    } catch (error) {
      console.log(error);
      //   res.status(400).json({ message: "failure", error: error.message });
      return Promise.reject(error);
    }
  },

  async GetByShowtimeId(req, res) {
    try {
      const { id } = req.params;

      const tickets = await TicketModel.aggregate([
        {
          $match: {
            showtimeId: mongoose.Types.ObjectId,
          },
        },
        {
          $lookup: {
            from: "seats",
            localField: "seatId",
            foreignField: "_id",
            as: "seat",
          },
        },
      ]);

      res.status(200).json({ message: "success", data: tickets });
    } catch (error) {
      res.status(400).json({ message: "fail", data: error.message });
    }
  },
};

module.exports = TicketController;
