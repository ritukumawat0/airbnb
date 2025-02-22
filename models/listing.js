const mongoose = require("mongoose");
const Review = require("./review")

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url:String,
    filename:String   
  },
  price: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  reviews:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Review"
    }
  ],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'], 
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing.reviews.length){
      await Review.deleteMany({_id:{$in:listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
