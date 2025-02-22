if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const Listing = require("./models/listing");
const wrapAsync = require("./utils/wrapAsync");
const listings = require("./routes/listing");
const reviews = require("./routes/review");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const users = require("./routes/user");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("ejs", ejsMate);

const store = MongoStore.create({
  mongoUrl:process.env.ATLUSDB_URL,
  crypto: {
    secret:process.env.SECRET 
  },
  touchAfter:24 * 3600
})

store.on("error",()=>{
  console.log("error in mongo session store",err)
})

const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000
  }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next()
})

async function main() {
  try {
    await mongoose.connect(process.env.ATLUSDB_URL);
    console.log("database connected!");
  } catch (err) {
    console.log(err);
  }
}
main();

app.listen("8080", (req, res) => {
  console.log("listening on port 8080");
});

app.get(
  "/",
  wrapAsync(async (req, res) => {
    let listings = await Listing.find();
    res.render("listings/index", { listings });
  })
);

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/",users);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  res.status(status).render("error", { err });
});
