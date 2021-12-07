const mongoose = require("mongoose");
const { Schema } = mongoose;

const BannerSchema = new Schema({
  image: {
    type: String,
    unique: true,
    required: [true, "image is required"],
  },
  movieId: {
    type: Schema.Types.ObjectId,
    required: [true, "Movie id is required"],
  },
  releaseDate: {
    type: Date,
    required: [true, "Release date is required"],
  },
  closeDate: {
    type: Date,
    required: [true, "Close date is required"],
  },
  order: {
    type: Number,
    default: -1,
  },
  createBy: {
    type: Schema.Types.ObjectId,
    required: [true, "Author of this banner is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updateBy: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  version: {
    type: Number,
    default: 0,
  },
  oldVersion: {
    type: [],
    default: [],
  },
});

module.exports = mongoose.model("Banner", BannerSchema);
