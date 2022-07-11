const express = require("express"),
  router = express.Router(),
  middleware = require("../middleware"),
  passport = require("passport"),
  User = require("../models/user");

// Mounted at "/user"

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  // const image = req.files.image;
  // image.mv(`public/photos/${image.name}`, err => {
  //   if (err) console.log(err);
  // });

  User.register(
    new User({
      username: req.body.username
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        // console.log(err);
        req.flash("error", err.message);
        return res.redirect("/user/register");
      }
      if (req.body.firstname) user.firstname = req.body.firstname;
      if (req.body.lastname) user.lastname = req.body.lastname;
      if (req.body.email) user.email = req.body.email;
      // user.image = `/photos/${image.name}`;
      user.save((err, user) => {
        if (err) console.log(err);
        else {
          passport.authenticate("local")(req, res, () => {
            req.flash(
              "success",
              "Successfully Signed Up as " +
              user.firstname +
              " " +
              user.lastname
            );
            res.redirect("/");
          });
        }
      });
    }
  );
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      req.flash("error", err);
      return res.redirect("/user/login");
    }
    if (!user) {
      req.flash("error", info.message);
      return res.redirect("/user/login");
    }
    req.logIn(user, err => {
      if (err) {
        req.flash("error", err);
        return res.redirect("/user/login");
      }
      req.flash(
        "success",
        "Successfully Signed In as " + user.firstname + " " + user.lastname
      );
      return res.redirect("/"); //temporarily changed
    });
  })(req, res, next);
});

router.get("/edit", middleware.isLoggedIn, (req, res) => {
  res.render("edit");
  // console.log(req.user);
});

// FIXME add email to update profile router and view page
router.post("/edit", middleware.isLoggedIn, (req, res) => {
  req.user.firstname = req.body.firstname || req.user.firstname;
  req.user.lastname = req.body.lastname || req.user.lastname;
  req.user.save((err, user) => console.log(err));
  res.redirect("/");
});

router.get("/logout", middleware.isLoggedIn, (req, res) => {
  req.logout();
  req.flash("success", "Successfully Logged Out");
  res.redirect("/");
});

router.get("/myprofile", middleware.isLoggedIn, (req, res) => {
  res.render("myprofile");
});

router.get("/allusers", middleware.isAdmin, (req, res) => {
  User.find().then(data => {
    res.send(data);
    // res.render('allusers', {data: data})
  });
});

router.get("/finduser", (req, res) => {
  User.find({
      $or: [{
          username: req.query.searchuserquery
        },
        {
          firstname: req.query.searchuserquery
        },
        {
          lastname: req.query.searchuserquery
        }
      ]
    })
    .then(users => {
      res.render("findUser", {
        users: users
      });
    })
    .catch(err => console.log(err));
});

module.exports = router;