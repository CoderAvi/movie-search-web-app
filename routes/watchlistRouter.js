const express = require("express"),
  router = express.Router(),
  config = require("../config"),
  User = require("../models/user");

const tmdbApiKey = config.tmdbApiKey,
  omdbApiKey = config.omdbApiKey;

// Mounted at "/user/mywatchlist"

router.get("/", (req, res) => {
  let user = req.user;
  // console.log(user.watchlist);

  let movies = [];
  if (user.watchlist.length) {
    for (let i = 0; i < user.watchlist.length; i++) {
      let imdbId = user.watchlist[i].imdbId;
      // console.log(imdbId);
      let watchlistUrl = `http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${imdbId}`;
      let options = {
        url: watchlistUrl,
        json: true
      };

      rp(options).then(data => {
        movies.push({
          imdbId: data.imdbID,
          title: data.Title,
          year: data.Year,
          poster: data.Poster,
          date: user.watchlist[i].createdAt
        });
        if (movies.length === user.watchlist.length) {
          movies.sort((movie1, movie2) => {
            return movie1.date > movie2.date ? -1 : 1;
          });
          res.render("list", {
            movies: movies
          });
        }
      });
    }
  } else {
    res.render("list", {
      movies: movies
    });
  }
});

router.get("/addToWatchlist/:imdbId", (req, res) => {
  let user = req.user;
  let obtainedImdbId = req.params.imdbId;
  user.watchlist.push({
    imdbId: obtainedImdbId
  });
  user.save();
  res.redirect("/search/moviedetails/" + req.params.imdbId);
});

router.get("/removeFromWatchlist/:imdbId", (req, res) => {
  let user = req.user;
  let obtainedImdbId = req.params.imdbId;
  User.findByIdAndUpdate(
    user._id, {
      $pull: {
        watchlist: {
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