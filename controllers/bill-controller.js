const mongoose = require("mongoose");
const BillModel = require("../models/bill-model");
const TicketController = require("./ticket-controller");
const mailer = require("../util/mailer");

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
};

module.exports = BillController;
