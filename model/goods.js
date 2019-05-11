const mongoose = require('mongoose')
const goods = new mongoose.Schema(
  {
    g_name: {
      type: String,
      required: true
    },
    g_price: {
      type: Number,
      required: true
    },
    poster: {
      type: String
    },
    g_desc: {
      type: String,
      default: "吃的健康，吃的放心"
    },
    storage: {
      type: Number,
      default: 1000
    },
    like: {
      type: Number,
      default: 999
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "category"
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
module.exports = mongoose.model("goods", goods);