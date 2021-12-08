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
// app.use(
//   fileUpload({
//     useTempFiles: true,
//   })
// );

// const Banner = require("./models/banner-model");
// const User = require("./models/user-model");
// const banner = new Banner({
//   image: "s",
//   movieId: mongoose.Types.ObjectId("61ada1b13dcf152655396e6c"),
//   releaseDate: new Date(),
//   closeDate: new Date(),
//   order: 0,
//   createBy: mongoose.Types.ObjectId("61ada1b13dcf152655396e6c"),
// });

// (async () => {
//   await banner.save();
// })();

// const Showtime = require("./models/showtime-model");
// const showtime = new Showtime({
//   movieId: mongoose.Types.ObjectId("61ada1b13dcf152655396e6c"),
//   timeStart: new Date(),
//   roomId: mongoose.Types.ObjectId("61ada1b13dcf152655396e6c"),
//   standardPrice: 50000,
//   vipPrice: 2000,
//   createBy: mongoose.Types.ObjectId("61ada1b13dcf152655396e6c"),
// });

// (async () => {
//   await showtime.save();
//   console.log(showtime);
// })();

// Connecting Routes

app.use("/api/banner", require("./routes/banner-routes"));
app.use("/api/user", require("./routes/user-routes"));
app.use("/api/movie", require("./routes/movie-routes"));
app.use("/api/permission", require("./routes/permission-routes"));
app.use('/api/room',require('./routes/room-routes'));
app.use('/api/seat',require('./routes/seat-routes'));
app.use('/api/upload',require('./routes/upload-routes'));

// const Movie = require('./models/movie-model')

// const movie = new Movie({
//     name:"SHANG-CHI AND THE LEGEND OF THE TEN RINGS 2",
//     image:"hih.png1",
//     trailer:"hihi.mp41",
//     description:"hihi",
//     label:"C13",
//     runningTime:90,
//     releaseDate:new Date("12-7-2021"),
// });

// (async ()=>{
//     await movie.save()
// })();

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
