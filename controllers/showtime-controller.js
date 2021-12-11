const ShowtimeModel = require("../models/showtime-model");
const TicketController = require("./ticket-controller");
const mongoose = require("mongoose");

const ShowtimeController = {
  async List(req, res) {
    try {
      const showtime = await ShowtimeModel.find();

      res.status(200).json({ message: "successfully!", data: showtime });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "failure!", error: error });
    }
  },

  async GetById(req, res) {
    try {
      // const showtime = await ShowtimeModel.aggregate([
      //   { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
      //   {
      //     $lookup: {
      //       from: "movies",
      //       localField: "movieId",
      //       foreignField: "_id",
      //       as: "movie",
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: "$movie",
      //       preserveNullAndEmptyArrays: true,
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "tickets",
      //       localField: "_id",
      //       foreignField: "showtimeId",
      //       as: "tickets",
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: "$tickets",
      //       preserveNullAndEmptyArrays: true,
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "seats",
      //       localField: "tickets.seatId",
      //       foreignField: "_id",
      //       as: "tickets.seat",
      //     },
      //   }
      // ]);

      const showtime = await ShowtimeModel.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "movies",
            localField: "movieId",
            foreignField: "_id",
            as: "movie",
          },
        },
        {
          $unwind: {
            path: "$movie",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "tickets",
            localField: "_id",
            foreignField: "showtimeId",
            as: "tickets",
          },
        },
        {
          $unwind: {
            path: "$tickets",
            preserveNullAndEmptyArrays: true,
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
        {
          $group: {
            _id: "$_id",
            movie: { $first: "$movie" },
            timeStart: { $first: "$timeStart" },
            roomId: { $first: "$roomId" },
            standardPrice: { $first: "$standardPrice" },
            vipPrice: { $first: "$vipPrice" },
            tickets: { $push: "$tickets" },
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

  Update(req, res) {
    try {
    } catch (error) {}
  },
};

module.exports = ShowtimeController;
