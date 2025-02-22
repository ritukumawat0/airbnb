const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchemaJoi , reviewSchemaJoi } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchemaJoi.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchemaJoi.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner._id.equals(req.user._id)) {
    req.flash("error", "you are not owner");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isAuthor = async(req,res,next)=>{
  const {id,revId } = req.params;
  const review = await Review.findById(revId);
  if (!review.author._id.equals(req.user._id)) {
    req.flash("error", "you are not owner");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
