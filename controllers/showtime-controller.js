const ShowtimeModel = require("../models/showtime-model");
const TicketController = require("./ticket-controller");
const mongoose = require("mongoose");

const ShowtimeController = {
  async List(req, res) {
    try {
      const showtime = await ShowtimeModel.aggregate([
        {
          $lookup: {
            from: "tickets",
            localField: "_id",
            foreignField: "showtimeId",
            as: "tickets",
          },
        },
        {
          $lookup: {
            from: "seats",
            localField: "tickets.seatId",
            foreignField: "_id",
            as: "tickets.seat",
          },
        },
      ]);

      res.status(200).json({ message: "successfully!", data: showtime });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "failure!", error: error });
    }
  },

  async GetById(req, res) {
    try {
      const showtime = await ShowtimeModel.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "tickets",
            localField: "_id",
            foreignField: "showtimeId",
            as: "tickets",
          },
        },
        {
          $lookup: {
            from: "seats",
            localField: "tickets.seatId",
            foreignField: "_id",
            as: "tickets.seat",
          },
        },
      ]);

      res.status(200).json({ message: "successfully!", data: showtime });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "failure!", error: error });
    }
  },

  async Create(req, res) {
    try {
      req.body.createBy = req.user.id;
      let showtime = new ShowtimeModel(req.body);
      showtime.timeStart = new Date(req.body.timeStart);

      await showtime.save();

      //create tickets
      const tickets = await TicketController.Create(
        showtime._id,
        showtime.roomId,
        userId
      );
      res.status(200).json({
        message: "successfully!",
        data: { showtime: showtime, tickets: tickets },
      });
    } catch (error) {
      res.status(400).json({ message: "failure", error: error.message });
    }
  },

  Update(req, res) {},
};

module.exports = ShowtimeController;
