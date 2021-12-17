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

  async GetByShowtimeId(id) {
    try {
      const tickets = await TicketModel.aggregate([
        {
          $match: {
            showtimeId: mongoose.Types.ObjectId(id),
            isAlive: true,
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
        {
          $unwind: {
            path: "$seat",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            seatId: { $first: "$seatId" },
            showtimeId: { $first: "$showtimeId" },
            status: { $first: "$status" },
            userId: { $first: "$userId" },
            row: { $first: "$seat.row" },
            column: { $first: "$seat.column" },
            isVip: { $first: "$seat.isVip" },
          },
        },
        {
          $sort: {
            row: 1,
            column: 1,
          },
        },
      ]);

      return Promise.resolve(tickets);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },

  async ChangeStatus(id, status) {
    try {
      const ticket = await TicketModel.findById(id);
      if (!ticket) return Promise.reject(new Error("Ticket not found!"));

      await ticket.update({
        status: status,
      });

      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async Disconnect(id) {
    await TicketModel.updateMany({ status: id }, { status: "free" });
  },

  async Buy(uid, ids) {
    for (let i = 0; i < ids.length; i++) {
      const ticket = await TicketModel.findById(ids[i]);
      if (!ticket) return Promise.reject(Error("Ticket not found!"));
      if (ticket.userId !== null)
        return Promise.reject(Error("Ticket is owned by another user"));
    }
    console.log("update rui ne");
    await TicketModel.updateMany(
      { _id: { $in: ids } },
      { $set: { userId: mongoose.Types.ObjectId(uid), status: "sold" } }
    );

    console.log("update rui ne");
    return Promise.resolve(true);
  },
};

module.exports = TicketController;
