const mongoose = require('mongoose')
const order = new mongoose.Schema(
    {
        // // order_address:{
        //     type:String
        // },
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref:"user"
        },
        goods:{
            type:mongoose.SchemaTypes.ObjectId,
            ref:"goods"
        },
        order_num:{
            type:Number,
            default:1
        },
        good_num: {
            type: Number,
            default: 1
        },
        total_price:Number,
        order_id:String

    },
    {
        versionKey: false,
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }

    })
    module.exports = mongoose.model("order",order)