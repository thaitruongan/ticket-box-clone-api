const ShowtimeModel = require("../models/showtime-model");
const TicketController = require("./ticket-controller");

const ShowtimeController = {
  async Create(req, res) {
    try {
      const userId = req.user.id;

      let showtime = new ShowtimeModel(req, body);
      showtime.createBy = userId;

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
