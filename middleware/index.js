var middlewareObj = {
  isLoggedIn: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "Please Login First");
    res.redirect("/user/login");
  },
  isAdmin: function (req, res, next) {
    if (req.user.admin) {
      return next();
    }
    req.flash("error", "You need administrative rights to access this");
    res.redirect("/user/login");
  }
};

module.exports = middlewareObj;
// This is javascript
