const Movie = require("../models/movie-model");
const mongoose = require("mongoose");
const { cache } = require("../controllers/cache-controller");

const movieController = {
  list: async (req, res) => {
    try {
      let movies = await cache.request(`list-movie`);
      if (!movies) {
        movies = await Movie.find({ isAlive: true });
        cache.set(`list-movie`, JSON.stringify(movies));
        return res.status(200).json({ message: "success", data: movies });
      }
      res.status(200).send({ message: "success", data: JSON.parse(movies) });
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
  getById: async (req, res) => {
    try {
      const movie = await Movie.findById(req.params.id);
      if (!movie) {
        return res.status(404).json({
          message: "Movie Not Found!",
        });
      }
      return res.status(200).json({
        message: "Success",
        data: movie,
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

    req.body.image = req.uploadData.url;
    req.body.createBy = req.user.id;
    const newMovie = new Movie(req.body);
    try {
      const saveMovie = await newMovie.save();
      res.status(200).json(saveMovie);
    } catch (err) {
      res.status(400).json({
        message: "Failed",
        error: err,
      });
    }
  },
  update: async (req, res) => {
    try {
      if (req.uploadData) req.body.image = req.uploadData.url;
      const movie = await Movie.findById(req.params.id);
      if (!movie) {
        return res.status(404).send({
          message: "Movie Not Found!",
        });
      }
      //this scope is already in try block
      let version = movie.version;
      req.body.updateBy = req.user.id;
      req.body.version = version + 1;
      req.body.updatedAt = new Date();
      const updateMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
          $push: {
            oldVersion: movie,
          },
        },
        { new: true }
      );
      cache.delete(`list-movie`);
      res.status(200).json({
        message: "Success",
        data: updateMovie,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: "Failed",
        error: err,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const movie = await Movie.findById(req.params.id);
      if (!movie) {
        return res.status(404).send({
          message: "Movie Not Found!",
        });
      }
      await movie.delete();
      cache.delete(`list-movie`);
      res.status(200).json({
        message: "Success! Movie has been deleted",
      });
    } catch (err) {
      res.status(400).json({
        message: "Failed",
        error: err,
      });
    }
  },
  search: async (req, res, next) => {
    try {
      let { name } = req.body;
      console.log(name);
      const movies = await Movie.find({
        name: {
          $regex: name,
        },
        isAlive: true,
      });
      res.status(200).json({
        message: "Success",
        data: movies,
      });
    } catch (err) {
      res.status(400).json({
        message: "Failed",
        error: err,
      });
    }
  },
};

module.exports = movieController;
