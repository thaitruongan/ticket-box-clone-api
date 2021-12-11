const Seat = require("../models/seat-model");
const mongoose = require("mongoose");

const seatController = {
  list: async (req, res) => {
    try {
      const seat = await Seat.aggregate([
        {
          $lookup: {
            from: "rooms",
            localField: "roomId",
            foreignField: "_id",
            as: "room_info",
          },
        },
        {
          $unwind: "$room_info",
        },
      ]);
      res.status(200).json({
        message: "Success",
        data: seat,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
  getById: async (req, res) => {
    try {
      const seat = await Seat.findById(req.params.id);
      if (!seat) {
        return res.status(404).json({
          message: "Seat Not Found!",
        });
      }
      return res.status(200).json({
        message: "Success",
        data: seat,
      });
    } catch (err) {
      res.status(400).json(err);
    }
  },
  create: async (req, res) => {
    req.body.createBy = req.user.id;
    const newSeat = new Seat(req.body);
    try {
      const saveSeat = await newSeat.save();
      res.status(200).json({
        message: "Success",
        data: saveSeat,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: "Failed",
        error: err,
      });
    }
  },
  update: async (req, res) => {
    try {
      const seat = await Seat.findById(req.params.id);

      if (!seat) {
        return res.status(404).send({
          message: "Seat Not Found!",
        });
      }
      const version = seat.version;
      req.body.updatedAt = new Date();
      req.body.version = version + 1;
      req.body.updateBy = req.user.id;
      const updateSeat = await Seat.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
          $push: {
            oldVersion: seat,
          },
        },
        { new: true }
      );
      res.status(200).json({
        message: "Success",
        data: updateSeat,
      });
    } catch (err) {
      res.status(400).json({
        message: "Failed",
        error: err,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const seat = await Seat.findById(req.params.id);
      if (!seat) {
        return res.status(404).send({
          message: "Seat Not Found!",
        });
      } else {
        await seat.delete();
        res.status(200).json({
          message: "Success! Seat has been deleted",
        });
      }
    } catch (err) {
      res.status(400).json({
        message: "Failed",
        error: err,
      });
    }
  },
};

module.exports = seatController;
