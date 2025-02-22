const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    created_at:{
        type:Date,
        default:new Date()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

const Review = mongoose.model("Review",reviewSchema);

module.exports = Review;