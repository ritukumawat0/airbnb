const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware");
const reviewConroller = require("../controllers/review");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewConroller.createReview)
);

router.delete("/:revId", isLoggedIn, isAuthor, reviewConroller.deleteReview);

module.exports = router;
