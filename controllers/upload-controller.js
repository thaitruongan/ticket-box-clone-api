const cloudinary = require("cloudinary");

const uploadController = {
  uploadFile: (req, res) => {
    if (!req.uploadData)
      return res.status(400).json({
        message: "fail",
        error: new Error("Image is required").message,
      });
    res.status(200).json(req.uploadData);
  },
};

module.exports = uploadController;
