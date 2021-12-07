const mongoose = require("mongoose");
const { Schema } = mongoose;

const PermissionSchema = new Schema({
  permission: {
    type:String,
    require:[true,"Permission is require"]
  },
  collectionName:{
    type:String,
    require:[true,"Collection name is require"]
  }    
});

module.exports = mongoose.model("Permission", PermissionSchema);
