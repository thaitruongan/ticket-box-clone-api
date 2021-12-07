const mongoose = require("mongoose");
const { Schema } = mongoose;

const MovieSchema = new Schema({
  name: {
    type:String,
    unique:true,
    require:[true,"Movie name is require"]
  },

  image: {
    type: String,
    unique:true,
    require:[true,"Image is require"]
  },

  trailer: {
    type: String,
    unique:true,
    require:[true,"Trailer is require"]
  },

  description: {
    type: String,
    required: [true, "Description is required"],
  },
  label:{
    type:String,
    required: [true, "Label is required"],
  },
  runningTime: {
    type: Number,
    required: [true, "Running time is required"],
    validate:{
        validator: function(rt){
            return rt > 0
        },
        message: (props) =>`${props.value} must be greater than 0`
    }
  },

  releaseDate: {
    type: Date,
    required: [true, "Release date is required"]
  },
  createBy:{
    type: Schema.Types.ObjectId,
    default: null,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },

  updatedAt: {
    type: Date,
    default: null,
  },

  updateBy: {
    type: Schema.Types.ObjectId,
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

module.exports = mongoose.model("Movie", MovieSchema);
