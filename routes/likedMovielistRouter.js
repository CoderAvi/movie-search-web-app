const express = require("express"),
  router = express.Router(),
  config = require("../config"),
  User = require("../models/user");

const tmdbApiKey = config.tmdbApiKey,
  omdbApiKey = config.omdbApiKey;

// Mounted at "/user/likedmovielist"

router.get("/", (req, res) => {
  let user = req.user;
  // console.log(user.likedMovielist);

  let movies = [];
  if (user.likedMovielist.length) {
    for (let i = 0; i < user.likedMovielist.length; i++) {
      let imdbId = user.likedMovielist[i].imdbId;
      // console.log(imdbId);
      let likedMovielistUrl = `http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${imdbId}`;
      let options = {
        url: likedMovielistUrl,
        json: true
      };

      rp(options).then(data => {
        movies.push({
          imdbId: data.imdbID,
          title: data.Title,
          year: data.Year,
          poster: data.Poster,
          date: user.likedMovielist[i].createdAt
        });
        if (movies.length === user.likedMovielist.length) {
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

router.get("/addToLikedMovielist/:imdbId", (req, res) => {
  let user = req.user;
  let obtainedImdbId = req.params.imdbId;
  user.likedMovielist.push({
    imdbId: obtainedImdbId
  });
  user.save();
  res.redirect("/search/moviedetails/" + req.params.imdbId);
});

router.get("/removeFromLikedMovielist/:imdbId", (req, res) => {
  let user = req.user;
  let obtainedImdbId = req.params.imdbId;
  User.findByIdAndUpdate(
    user._id, {
      $pull: {
        likedMovielist: {
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