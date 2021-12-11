const ShowtimeModel = require("../models/showtime-model");
const TicketController = require("./ticket-controller");
const mongoose = require("mongoose");
const MovieModel = require("../models/movie-model");

const ShowtimeController = {
  async List(req, res) {
    try {
      let tmp = new Date("12-11-2021");
      tmp.setHours(10);
      tmp.setMinutes(59);
      let check = await ShowtimeController.TimeCheck(
        tmp,
        "61aedafbc5c70c6293511675",
        "61b2d0135b2065af8e65c4f7"
      );

      console.log("check", check);

      const showtime = await ShowtimeModel.find();

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
        showtime.roomId
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

  async TimeCheck(timeStart, movieId, roomId) {
    try {
      const movie = await MovieModel.findOne({
        _id: movieId,
        releaseDate: {
          $lt: timeStart,
        },
      });
      if (movie === null) return false;

      let timeEnd = new Date(timeStart);
      console.log(timeEnd);
      timeEnd.setMinutes(timeEnd.getMinutes() + movie.runningTime);

      let top = new Date(timeStart);
      top.setHours(top.getHours() - 5);

      let bottom = new Date(timeStart);
      bottom.setHours(bottom.getHours() + 5);
      console.log(top, top.getHours(), top.getMinutes());
      console.log(bottom, bottom.getHours(), bottom.getMinutes());
      console.log(timeStart, timeStart.getHours(), timeStart.getMinutes());
      console.log(top > bottom);
      const showtime = await ShowtimeModel.aggregate([
        {
          $match: {
            roomId: mongoose.Types.ObjectId(roomId),
            timeStart: {
              $gt: top,
              $lt: bottom,
            },
          },
        },
        {
          $lookup: {
            from: "movies",
            localField: "movieId",
            foreignField: "_id",
            as: "movie",
          },
        },
      ]);
      if (showtime === null) return true;

      for (let i = 0; i < showtime.length; i++) {
        let tmpDate = new Date(showtime[i].timeStart);
        tmpDate.setMinutes(
          tmpDate.getMinutes() + showtime[i].movie[0].runningTime
        );

        console.log(
          timeStart.getHours(),
          timeStart.getMinutes(),
          timeEnd.getHours(),
          timeEnd.getMinutes(),
          showtime[i].timeStart.getHours(),
          showtime[i].timeStart.getMinutes()
        );

        if (timeStart >= showtime[i].timeStart && timeStart <= tmpDate)
          return false;

        if (timeEnd >= showtime[i].timeStart && timeEnd <= tmpDate)
          return false;
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};

module.exports = ShowtimeController;
