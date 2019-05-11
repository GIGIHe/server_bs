const mongoose = require("mongoose");
const adminUser = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: "http://pbl.yaojunrong.com/avatar4.jpg"
    },
    desc: {
      type: String,
      default: "我爱工作，就如我爱生活"
    },
    tel: {
      type: String,
      default: "联系方式"
    },
    level:{
      type:Number,
      default:0
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);
module.exports = mongoose.model("adminUser", adminUser);
