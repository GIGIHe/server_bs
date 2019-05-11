const mongoose = require('mongoose')
const category = new mongoose.Schema(
  {
    c_name: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);
module.exports = mongoose.model("category", category);