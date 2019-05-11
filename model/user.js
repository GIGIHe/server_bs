const mongoose = require("mongoose");
const user = new mongoose.Schema(
  {
   username:{
        type:String,
        required:true,
        unique:true
    },
    password: {
      required: true,
      type: String,
    },
    avatar: String,
    desc:{
        type:String,
        default:'这人很懒'
    },
    phone:{
        type:Number,
        unique:true,
        required:true
    },
    // address:{
    //   type: String,
    //   default:"河南省驻马店市驿城区黄淮学院"
    // }
    city: {
      type: String,
      default: "驻马店"
    },
    area: {
      type: String,
      default: "驿城区"
    },
    stress: {
      type: String,
      default: "黄淮学院"
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);
module.exports = mongoose.model("user", user); //表名，骨架名
