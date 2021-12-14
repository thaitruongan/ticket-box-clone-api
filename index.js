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

const server = http.createServer(app);
socketIo(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 5001 || 5001;
server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
