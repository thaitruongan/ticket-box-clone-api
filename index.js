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
  console.log(err);
});

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "408075301782-j39rulkr2te17lttl2fp29pigqq1u3qt.apps.googleusercontent.com"
);
async function verify() {
  const ticket = await client.verifyIdToken({
    idToken:
      "eyJhbGciOiJSUzI1NiIsImtpZCI6ImMxODkyZWI0OWQ3ZWY5YWRmOGIyZTE0YzA1Y2EwZDAzMjcxNGEyMzciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNDA4MDc1MzAxNzgyLWozOXJ1bGtyMnRlMTdsdHRsMmZwMjlwaWdxcTF1M3F0LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNDA4MDc1MzAxNzgyLWozOXJ1bGtyMnRlMTdsdHRsMmZwMjlwaWdxcTF1M3F0LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEwMDA3MTcxMjY0OTg1ODQ5NDQxIiwiZW1haWwiOiJsb25naG9oMjIyMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlZleUluM25JWkZ3eVdLbDlMcmNJNVEiLCJuYW1lIjoiTE9ORyBI4buSIFBIQU4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2hKUncwazhfREt4X1VfNmRTVDIxVk9RN3FvZUFjel8wdDRjR3ZPPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkxPTkcgSOG7kiIsImZhbWlseV9uYW1lIjoiUEhBTiIsImxvY2FsZSI6InZpIiwiaWF0IjoxNjM5NDYxMzQxLCJleHAiOjE2Mzk0NjQ5NDEsImp0aSI6ImNkOGFhNThlYTM0OTk3MTY2OTljM2VhMmZlNzQ1YTVkYWJjZTZkYjQifQ.CIKdSuABXFTTLAyOGZwmBihZKCUxZMZiTGQjL2kIww3aDJTJA9xMXrx31xuWYlMnRXyLVyR0u-z8pT2jKWMDczn8IVWKa2cDCWpK-CXO3aZEdUOfpDqvaqsRWbuWXGtM1A8GpDObYejOpcS4aVM5tldbSPYTUr9V0qWTq-RmPgtqaH-H571EUtaDDeQRNtPQS8xg4Gezdfs57XnzEp7ATlo87vgWIEN1sRpi6DB6BYkbiwWkRmvs4jbkpjSd1j2ReqvES89-SmfRP5E9m5Vhnn9XRF-qoAz7yt77o3lYU_CHvLO_ZTbJ0GRBkFoXeJzsegaqzv2PNcwr4nOZe04bZQ",
    audience:
      "408075301782-j39rulkr2te17lttl2fp29pigqq1u3qt.apps.googleusercontent.com", // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload["sub"];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  console.log(ticket);
  console.log(userid);
  console.log(payload);
}
verify().catch(console.error);

const server = http.createServer(app);
socketIo(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 5001 || 5001;
server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
