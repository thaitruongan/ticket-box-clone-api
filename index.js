require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const connectDB = require("./config/db");
const io = require("socket.io");
const http = require("http");
const fs = require("fs");

const TicketController = require("./controllers/ticket-controller");

connectDB();
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(cookieParser());

app.use("/api-docs", require("./routes/docs"));

app.use("/api/banner", require("./routes/banner-routes"));
app.use("/api/user", require("./routes/user-routes"));
app.use("/api/movie", require("./routes/movie-routes"));
app.use("/api/permission", require("./routes/permission-routes"));
app.use("/api/room", require("./routes/room-routes"));
app.use("/api/seat", require("./routes/seat-routes"));
// app.use("/api/upload", require("./routes/upload-routes"));
// app.use("/api/ticket", require("./routes/ticket-routes"));
app.use("/api/showtime", require("./routes/showtime-routes"));
app.use("/api/payment", require("./routes/bill-routes"));

app.get("/image/:url", (req, res) => {
  res.sendFile(path.join(__dirname, `uploads/${req.params.url}`));
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}
const mailer = require("./util/mailer");
mailer("ben.anthai99@gmail.com", ["1", "2", "3", "4"]);
const server = http.createServer(app);
const socketIo = io(server, { cors: { origin: "*" } });

socketIo.on("connection", (socket) => {
  console.log("New client connected" + socket.id);

  socket.on("get-data", (id) => {
    async function getData(id) {
      const tickets = await TicketController.GetByShowtimeId(id);
      socket.emit("get-data", tickets);
      socket.broadcast.emit("get-data", tickets);
    }
    getData(id);
  });

  socket.emit("welcome", socket.id);
  socket.on("id", (_data) => {
    // for (let i = 0; i < _data.length; i++) {
    //   for (let j = 0; j < data.length; j++) {
    //     if (_data[i]._id === data[j]._id) {
    //       // data[j] = _data[i];
    //       data[j].status = "free";
    //       data[userId] = "";
    //     }
    //   }
    // }
    // socket.broadcast.emit("get-data", data);
  });
  socket.on("pick-new-ticket", function (data) {
    //change ticket to hold

    //return data for this client
    // socket.broadcast.emit("get-data", data);
    async function getData(id) {
      await TicketController.ChangeStatus(data.ticketId, socket.id);
      const tickets = await TicketController.GetByShowtimeId(id);

      socket.broadcast.emit("get-data", tickets);
    }
    getData(data.showtimeId);
  });

  socket.on("cancel-ticket", function (data) {
    console.log(data);
    async function cancelTicket() {
      await TicketController.ChangeStatus(data.ticketId, "free");

      // socket.emit("get-data", data);
      async function getData(id) {
        const tickets = await TicketController.GetByShowtimeId(id);
        socket.emit("get-data", tickets);
        socket.broadcast.emit("get-data", tickets);
      }
      getData(data.showtimeId);
    }

    cancelTicket();
    // socket.broadcast.emit("get-data", data);
  });

  socket.on("ClientSendDataRemove", function (data) {});

  socket.on("Timeout", function (data) {
    (async () => {
      await TicketController.Disconnect(socket.id);
    })();
    console.log("timeout", data);
    async function getData(id) {
      const tickets = await TicketController.GetByShowtimeId(id);
      socket.emit("get-data", tickets);
      socket.broadcast.emit("get-data", tickets);
    }
    getData(data.showtimeId);
  });

  socket.on("pay", (data) => {
    try {
      (async () => {
        await TicketController.ChangeStatus(data.ticketId, data.userId);
      })();
      socket.emit("pay", { status: "success" });
    } catch (error) {
      socket.emit("pay", { status: "error", error: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected`);
    console.log(socket.id);
    (async () => {
      await TicketController.Disconnect(socket.id);
    })();
  });
});

const PORT = process.env.PORT || 5001 || 5001;
server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
