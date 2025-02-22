const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { validateListing } = require("../middleware");
const { isLoggedIn, isOwner } = require("../middleware");
const listingConroller = require("../controllers/listing");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

router.get("/new", isLoggedIn, listingConroller.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingConroller.showListing))
  .put(isLoggedIn,upload.single("listing[image]"), validateListing,wrapAsync(listingConroller.editListing))
  .delete(isLoggedIn, wrapAsync(listingConroller.destroyListing));

router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingConroller.createListing)
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingConroller.renderEditForm)
);

module.exports = router;
