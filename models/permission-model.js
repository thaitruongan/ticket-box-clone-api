const mongoose = require("mongoose");
const { Schema } = mongoose;

const PermissionSchema = new Schema({
  permission: {
    type:String,
    required:[true,"Permission is require"]
  },
  collectionName:{
    type:String,
    required:[true,"Collection name is require"]
  }    
});

module.exports = mongoose.model("Permission", PermissionSchema);
