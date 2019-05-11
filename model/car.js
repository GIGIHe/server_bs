const mongoose = require("mongoose");
const shop_car = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user"
    },
    goods: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "goods"
    },
    counts:{
        type: Number,
        default:1
    },
    checked:String
},{
    versionKey:false,
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
})
module.exports = mongoose.model("shop_car",shop_car)