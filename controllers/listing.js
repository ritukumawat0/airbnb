const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "listing you requested for display does not exist!");
    return res.redirect("/");
  }
  res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename; 
  req.flash("success", "listing created successfully!");
  let listing = new Listing({ ...req.body.listing });
  listing.image.url = url;
  listing.image.filename = filename;
  listing.geometry = response.body.features[0].geometry
  listing.owner = req.user._id;
  let savedListing = await listing.save();
  res.redirect("/");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing you requested for edit does not exist!");
    return res.redirect("/");
  }
  let orignalImageUrl = listing.image.url;
  orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_208,h_96/");
  res.render("listings/edit", { listing, orignalImageUrl });
};

module.exports.editListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "send valid data for listing");
  }
  const { id } = req.params;
  let upadtedListing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true }
  );

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    upadtedListing.image = { url, filename };
    await upadtedListing.save();
  }

  if (!upadtedListing) {
    throw new ExpressError(400, "send valid listing id");
  }
  req.flash("success", "listing edited successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    throw new ExpressError(400, "send valid listing id");
  }
  req.flash("success", "listing deleted successfully!");
  res.redirect("/");
};
