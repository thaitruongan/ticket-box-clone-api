const Banner = require("../models/banner-model");

const mongoose = require("mongoose");
const { cache } = require("../controllers/cache-controller");

const bannerController = {
  list: async (req, res) => {
    try {
      let banners = await cache.request(`list-banner`);

      if (!banners) {
        banners = await Banner.aggregate([
          {
            $match: {
              isAlive: true,
            },
          },
          {
            $lookup: {
              from: "movies",
              localField: "movieId",
              foreignField: "_id",
              as: "movie_info",
            },
          },
        ]);

        cache.set(`list-banner`, JSON.stringify(banners));

        return res.status(200).json({ message: "success", data: banners });
      }

      res.status(200).json({
        message: "Success",
        data: JSON.parse(banners),
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "fail", error: err.message });
    }
  },
  getById: async (req, res) => {
    try {
      const banner = await Banner.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
        isAlive: true,
      });
      if (!banner) {
        return res.status(404).json({
          message: "Banner Not Found!",
        });
      }
      return res.status(200).json({
        message: "Success",
        data: banner,
      });
    } catch (err) {
      res.status(400).json(err);
    }
  },
  create: async (req, res) => {
    if (!req.uploadData)
      return res.status(400).json({
        message: "fail",
        error: new Error("Image is required").message,
      });
    try {
      req.body.createBy = req.user.id;
      const newBanner = new Banner({
        movieId: req.body.movieId,
        image: req.uploadData.url,
        createBy: req.user.id,
      });
      const saveBanner = await newBanner.save();
      cache.delete(`list-banner`);
      res.status(200).json(saveBanner);
    } catch (err) {
      res.status(400).json({
        message: "Failed",
        error: err,
      });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    if (req.uploadData) req.body.image = req.uploadData.url;
    try {
      const banner = await Banner.findById(id);
      if (!banner) {
        return res.status(404).send({
          message: "Banner Not Found!",
        });
      }
      let version = banner.version;

      req.body.updateBy = mongoose.Types.ObjectId(req.user.id);
      req.body.updatedAt = new Date();
      req.body.version = version + 1;

      let update = {
        $set: req.body,
        $push: {
          oldVersion: banner,
        },
      };
      await banner.update(update, { new: true });
      const updatedBanner = await Banner.findById(id);
      cache.delete(`list-banner`);
      res.status(200).json({
        message: "Success",
        data: updatedBanner,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: "Failed",
        error: err.message,
      });
    }
  },
};

module.exports = bannerController;
