const ShowtimeModel = require("../models/showtime-model");
const TicketController = require("./ticket-controller");
const mongoose = require("mongoose");
const MovieModel = require("../models/movie-model");
const RoomModel = require("../models/room-model");

const ShowtimeController = {
  async List(req, res) {
    try {
      const showtime = await ShowtimeModel.aggregate([
        {
          $match: { isAlive: true },
        },
        {
          $lookup: {
            from: "rooms",
            localField: "roomId",
            foreignField: "_id",
            as: "room",
          },
        },
      ]);

      res.status(200).json({ message: "successfully!", data: showtime });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "failure!", error: error });
    }
  },

  async GetByFilmId(req, res) {
    try {
      const showtime = await ShowtimeModel.aggregate([
        { $match: { movieId: mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "movies",
            localField: "movieId",
            foreignField: "_id",
            as: "movie",
          },
        },
        {
          $lookup: {
            from: "rooms",
            localField: "roomId",
            foreignField: "_id",
            as: "room",
          },
        },
      ]);

      res.status(200).json({ message: "successfully!", data: showtime });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "failure!", error: error });
    }
  },

  async GetByFilmIdAndDate(req, res) {
    const day = req.body.date;
    let start = new Date(day);
    start.setHours(0);
    start.setMinutes(0);
    let end = new Date(day);
    end.setHours(23);
    end.setMinutes(59);
    try {
      const showtime = await ShowtimeModel.aggregate([
        {
          $match: {
            movieId: mongoose.Types.ObjectId(req.params.id),
            timeStart: {
              $gt: start,
              $lt: end,
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
        {
          $lookup: {
            from: "rooms",
            localField: "roomId",
            foreignField: "_id",
            as: "room",
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
            from: "movies",
            localField: "movieId",
            foreignField: "_id",
            as: "movie",
          },
        },
        {
          $lookup: {
            from: "rooms",
            localField: "roomId",
            foreignField: "_id",
            as: "room",
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
      let tmp = new Date(req.body.timeStart);
      const _room = await RoomModel.findById(req.body.roomId);
      const _movie = await MovieModel.findById(req.body.movieId);

      if (!_room || !_movie)
        return res.status(400).json({
          message: "fail",
          error: new Error("Invalid room or movie!").message,
        });

      let check = await ShowtimeController.TimeCheck(
        tmp,
        req.body.movieId,
        req.body.roomId
      );

      console.log("check", check);
      if (!check) {
        return res.status(400).json({
          message: "Room is not empty at this time!",
        });
      }
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
    if (timeStart <= new Date()) return false;
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
