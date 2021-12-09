const Movie = require("../models/movie-model");
const mongoose = require("mongoose");

const movieController = {
  list: async (req, res) => {
    try {
      const movies = await Movie.find();
      res.status(200).json({
        message: "Success",
        data: movies,
      });
    } catch (err) {
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
    const newMovie = new Movie(req.body);
    newMovie.createdBy = mongoose.Types.ObjectId(req.user.id);
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
      const movie = await Movie.findById(req.params.id);
      if (!movie) {
        return res.status(404).send({
          message: "Movie Not Found!",
        });
      }
      //this scope is already in try block
      let version = movie.version;
      const updateMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json({
        message: "Success",
        data: updateMovie,
      });
    } catch (err) {
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
