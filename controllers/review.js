const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(400, "send valid listing id");
  }
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  await newReview.save();
  listing.reviews.push(newReview);
  await listing.save();
  req.flash("success", "new review added successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, revId } = req.params;
  await Review.findByIdAndDelete(revId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: revId } });
  req.flash("success", "review deleted successfully!");
  res.redirect(`/listings/${id}`);
};
