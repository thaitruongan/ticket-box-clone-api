require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const connectDB = require("./config/db");

connectDB();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.get("/api", (req, res) => {
  res.send("hihi");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
