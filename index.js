require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const connectDB = require("./config/db");
const socketIo = require("socket.io");
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
socketIo(server, { cors: { origin: "*" } });

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
