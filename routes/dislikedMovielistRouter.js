const express = require("express"),
  router = express.Router(),
  config = require("../config"),
  User = require("../models/user");

const tmdbApiKey = config.tmdbApiKey,
  omdbApiKey = config.omdbApiKey;

// Mounted at "/user/dislikedmovielist"

router.get("/", (req, res) => {
  let user = req.user;
  // console.log(user.dislikedMovielist);

  let movies = [];
  if (user.dislikedMovielist.length) {
    for (let i = 0; i < user.dislikedMovielist.length; i++) {
      let imdbId = user.dislikedMovielist[i].imdbId;
      let dislikedMovielistUrl = `http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${imdbId}`;
      let options = {
        url: dislikedMovielistUrl,
        json: true
      };

      rp(options).then(data => {
        movies.push({
          imdbId: data.imdbID,
          title: data.Title,
          year: data.Year,
          poster: data.Poster,
          date: user.dislikedMovielist[i].createdAt
        });
        if (movies.length === user.dislikedMovielist.length) {
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

router.get("/addToDislikedMovielist/:imdbId", (req, res) => {
  let user = req.user;
  // console.log(user);
  let obtainedImdbId = req.params.imdbId;
  user.dislikedMovielist.push({
    imdbId: obtainedImdbId
  });
  user.save();
  res.redirect("/search/moviedetails/" + req.params.imdbId);
});

router.get("/removeFromDislikedMovielist/:imdbId", (req, res) => {
  let user = req.user;
  let obtainedImdbId = req.params.imdbId;
  User.findByIdAndUpdate(
    user._id, {
      $pull: {
        dislikedMovielist: {
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