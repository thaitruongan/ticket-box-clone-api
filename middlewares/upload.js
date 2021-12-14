const fs = require("fs");
const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    fs.mkdir(path.join(__dirname, "uploads"), (err) => {
      console.log(err);
    });
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`.replace(" ", ""));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    console.log("ext", ext);
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".webp") {
      cb("Only jpg, png, webp is allowed", false);
    }
    cb(null, true);
  },
}).single("file");

module.exports = async function (req, res, next) {
  upload(req, res, (err, status) => {
    if (err) {
      return res.status(400).json({
        message: false,
        error: err,
      });
    }
    console.log(res.req.file);
    if (!res.req.file) return next();
    req.uploadData = {
      message: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    };
    next();
  });
};
