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
app.use("/api/upload", require("./routes/upload-routes"));
app.use("/api/ticket", require("./routes/ticket-routes"));
app.use("/api/showtime", require("./routes/showtime-routes"));

app.get("/image/:url", (req, res) => {
  res.sendFile(path.join(__dirname, `uploads/${req.params.url}`));
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

fs.mkdir("/app/uploads", (err) => {
  console.log("this folder is already exists");
});

const server = http.createServer(app);
const socketIo = io(server, { cors: { origin: "*" } });

let data = [
  {
    _id: "61b2dc5efac1c383ed99d772",
    seatId: "61b2d0135b2065af8e65c4f9",
    showtimeId: "61b2dc5efac1c383ed99d76f",
    status: "free",
    userId: null,
    row: "A",
    column: 1,
    isVip: true,
  },
  {
    _id: "61b2dc5ffac1c383ed99d774",
    seatId: "61b2d0135b2065af8e65c4fb",
    showtimeId: "61b2dc5efac1c383ed99d76f",
    status: "free",
    userId: null,
    row: "A",
    column: 2,
    isVip: false,
  },
  {
    _id: "61b2dc5ffac1c383ed99d776",
    seatId: "61b2d0135b2065af8e65c4fd",
    showtimeId: "61b2dc5efac1c383ed99d76f",
    status: "free",
    userId: null,
    row: "A",
    column: 3,
    isVip: false,
  },
  {
    _id: "61b2dc5ffac1c383ed99d778",
    seatId: "61b2d0135b2065af8e65c4ff",
    showtimeId: "61b2dc5efac1c383ed99d76f",
    status: "free",
    userId: null,
    row: "A",
    column: 4,
    isVip: false,
  },
  {
    _id: "61b2dc5ffac1c383ed99d77a",
    seatId: "61b2d0135b2065af8e65c501",
    showtimeId: "61b2dc5efac1c383ed99d76f",
    status: "free",
    userId: null,
    row: "A",
    column: 5,
    isVip: false,
  },
  {
    _id: "61b2dc5ffac1c383ed99d77c",
    seatId: "61b2d0135b2065af8e65c503",
    showtimeId: "61b2dc5efac1c383ed99d76f",
    status: "free",
    userId: null,
    row: "B",
    column: 1,
    isVip: false,
  },
  {
    _id: "61b2dc5ffac1c383ed99d77e",
    seatId: "61b2d0135b2065af8e65c505",
    showtimeId: "61b2dc5efac1c383ed99d76f",
    status: "free",
    userId: null,
    row: "B",
    column: 2,
    isVip: false,
  },
  {
    _id: "61b2dc5ffac1c383ed99d780",
    seatId: "61b2d0145b2065af8e65c507",
    showtimeId: "61b2dc5efac1c383ed99d76f",
    status: "free",
    userId: null,
    row: "B",
    column: 3,
    isVip: false,
  },
  {
    _id: "61b2dc5ffac1c383ed99d782",
    seatId: "61b2d0145b2065af8e65c509",
    showtimeId: "61b2dc5efac1c383ed99d76f",
    status: "free",
    userId: null,
    row: "B",
    column: 4,
    isVip: false,
  },
  {
    _id: "61b2dc5ffac1c383ed99d784",
    seatId: "61b2d0145b2065af8e65c50b",
    showtimeId: "61b2dc5efac1c383ed99d76f",
    status: "free",
    userId: null,
    row: "B",
    column: 5,
    isVip: false,
  },
];

socketIo.on("connection", (socket) => {
  console.log("New client connected" + socket.id);

  socket.emit("get-data", data);

  socket.emit("welcome", socket.id);
  socket.on("id", (_data) => {
    for (let i = 0; i < _data.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (_data[i]._id === data[j]._id) {
          data[j] = _data[i];
        }
      }
    }

    socket.broadcast.emit("get-data", data);
  });
  socket.on("pick-new-ticket", function (_data) {
    //change ticket to hold
    for (let i = 0; i < data.length; i++) {
      if (data[i]._id === _data.ticket) {
        data[i].status = _data.id;
        console.log("pick", data[i]);
        break;
      }
    }

    //return data for this client
    socket.broadcast.emit("get-data", data);
  });

  socket.on("cancel-ticket", function (id) {
    for (let i = 0; i < data.length; i++) {
      if (data[i]._id === id) {
        data[i].status = "free";
        break;
      }
    }

    socket.emit("get-data", data);
    socket.broadcast.emit("get-data", data);
  });

  socket.on("ClientSendDataRemove", function (data) {
    socketIo.sockets.emit("serverSendDataRemove", data);
  });

  socket.on("Timeout", function (data) {
    console.log("time out");
    console.log(data);
    socketIo.sockets.emit("ServerSendDataTimeOut", data);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected`);
  });
});

const PORT = process.env.PORT || 5001 || 5001;
server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
