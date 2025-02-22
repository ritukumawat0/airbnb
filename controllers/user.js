const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");

module.exports.signupForm = (req, res) => {
  res.render("users/signup");
};

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let newUser = new User({
      email: email,
      username: username,
    });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "welcome to wanderlust!");
      return res.redirect("/");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = async (req, res) => {
  req.flash("success", "welcome back to wanderlust!");
  res.redirect(res.locals.redirectUrl || "/");
};

module.exports.logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you have logged out successfully!");
    res.redirect("/");
  });
};
