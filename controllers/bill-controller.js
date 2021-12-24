const mongoose = require("mongoose");
const BillModel = require("../models/bill-model");
const TicketController = require("./ticket-controller");
const mailer = require("../util/mailer");
const TicketModel = require("../models/ticket-model");
const MovieModel = require("../models/movie-model");
const SeatModel = require("../models/seat-model");
const RoomModel = require("../models/room-model");
const ShowtimeModel = require("../models/showtime-model");
const BillController = {
  async Payment(req, res) {
    try {
      if (!req.user.id)
        return res.status(400).json({
          message: "fail",
          error: new Error("User is not logged in!").message,
        });

      const { ticketsId, totalPrice, phoneNumber, email } = req.body;
      if (ticketsId.length === 0)
        return res.status(400).json({
          message: "fail",
          error: new Error("Tickets is empty").message,
        });

      const bill = new BillModel({
        userId: mongoose.Types.ObjectId(req.user.id),
        tickets: ticketsId,
        totalPrice: totalPrice,
        phoneNumber: phoneNumber,
        email: email,
      });

      let _tickets = await TicketController.Buy(req.user.id, ticketsId);
      //send Email
      mailer(email, _tickets);
      await bill.save();

      res.status(200).json({ message: "Success", data: bill });
    } catch (error) {
      res.status(400).json({
        message: "fail",
        error: error.message,
      });
    }
  },

  async Get(req, res) {
    if (!req.user) return res.status(404).json({ message: "invalid user" });

    try {
      const bills = await BillModel.find({
        userId: mongoose.Types.ObjectId(req.user.id),
      });

      if (bills.length === 0)
        return res.status(200).json({ message: "success", data: [] });

      let bill = [];

      for (let i = 0; i < bills.length; i++) {
        let obj = {};
        obj.tickets = bills[i].tickets;
        obj.totalPrice = bills[i].totalPrice;
        obj.created = bills[i].createdDate;
        bill.push(obj);
      }

      for (let i = 0; i < bill.length; i++) {
        for (let j = 0; j < bill[i].tickets.length; j++) {
          bill[i].tickets[j] = mongoose.Types.ObjectId(bill[i].tickets[j]);
        }
      }

      for (let i = 0; i < bill.length; i++) {
        let tickets = await TicketModel.aggregate([
          {
            $match: {
              _id: {
                $in: bill[i].tickets,
              },
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

        bill[i]._tickets = tickets;
        console.log(bill);
        let showtime = await ShowtimeModel.findOne({
          _id: mongoose.Types.ObjectId(bill[i]._tickets[0].showtimeId),
        });

        bill[i].timeStart = showtime.timeStart;
        bill[i].vipPrice = showtime.vipPrice;
        bill[i].standardPrice = showtime.standardPrice;
        bill[i].timeStart = showtime.timeStart;

        let movie = await MovieModel.findOne({
          _id: mongoose.Types.ObjectId(showtime.movieId),
        });

        bill[i].movie = movie;

        let room = await RoomModel.findOne({
          _id: mongoose.Types.ObjectId(showtime.roomId),
        });

        bill[i].room = room;
      }

      res.status(200).json({ message: "success", data: bill });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "fail", error: error.message });
    }
  },
};

module.exports = BillController;
