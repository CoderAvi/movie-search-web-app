const express = require("express"),
  router = express.Router(),
  config = require("../config"),
  User = require("../models/user");

// Mounted at "/user/myratings"

router.get("/addRating/:imdbId", (req, res) => {
  let user = req.user;
  let obtainedImdbId = req.params.imdbId;
  user.rating.push({
    imdbId: obtainedImdbId,
    rating: req.query.rating
  });
  user.save();
  res.redirect("/search/moviedetails/" + req.params.imdbId);
});

router.get("/updateRating/:imdbId", (req, res) => {
  let user = req.user;
  let obtainedImdbId = req.params.imdbId;
  user.rating.find(movie => movie.imdbId === obtainedImdbId).rating =
    req.query.rating;
  user.save();
  res.redirect("/search/moviedetails/" + req.params.imdbId);
});

router.get("/removeRating/:imdbId", (req, res) => {
  let user = req.user;
  let obtainedImdbId = req.params.imdbId;
  User.findByIdAndUpdate(
    user._id, {
      $pull: {
        rating: {
          imdbId: obtainedImdbId
        }
      }
    }, {
      safe: true,
      upsert: true
    },
    (err, doc) => {
      if (err) console.log(err);
    }
  );
  res.redirect("/search/moviedetails/" + req.params.imdbId);
});

module.exports = router;