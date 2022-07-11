const express = require("express"),
  router = express.Router(),
  config = require("../config"),
  request = require("request"),
  rp = require("request-promise");

const tmdbApiKey = config.tmdbApiKey,
  omdbApiKey = config.omdbApiKey;

// Mounted at "/search"

peopleList = [];

router.get("/results", (req, res) => {
  let searchquery = req.query.searchquery;
  let type = req.query.type;
  if (type == "people") {
    let url = `https://api.themoviedb.org/3/search/person?api_key=${tmdbApiKey}&language=en-US&query=${searchquery}&page=1&include_adult=false`;
    request(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let people = JSON.parse(body);
        people.results.forEach(result => peopleList.push(result));
        // console.log(peopleList);
        res.render("resultsPeople", {
          people: people
        });
      }
    });
  } else {
    let url = `http://www.omdbapi.com/?apikey=${omdbApiKey}&s=${searchquery}&type=${type}`;
    request(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let data = JSON.parse(body);
        // console.log(data.Search);
        res.render("results", {
          movies: data.Search,
          response: data.Response,
          error: data.Error,
        });
      }
    });
  }
});

router.get("/get/:type/:tmdbId", (req, res) => {
  let { tmdbId, type } = req.params;
  console.log(type);
  let url = `https://api.themoviedb.org/3/movie/${tmdbId}/${type}?api_key=${tmdbApiKey}&language=en-US&page=1`;
  console.log(url);
  request(url, (err, resp, body) => {
    let data = JSON.parse(body);
    // console.log(data.results);
    let results = data.results;

    let moviesList = [];
    let count = 0;
    results.map((result) => {
      let getImdbId = `https://api.themoviedb.org/3/movie/${result.id}?api_key=${tmdbApiKey}`;
      request(getImdbId, (err, resp, body) => {
        count++;
        let imdbData = JSON.parse(body);
        let imdbId = imdbData.imdb_id;
        moviesList.push({
          "Title": result.title,
          "Year": result.release_date.split("-")[0],
          "Poster": "https://image.tmdb.org/t/p/w300" + result.poster_path,
          "imdbID": imdbId,
        });
        if (count === 20) {
          // console.log(moviesList);
          res.render('results', {
            movies: moviesList,
            response: "True",
            error: null
          });
        }
      });
    });
  });
});

router.get("/persondetails/:personid", (req, res) => {
  let id = req.params.personid;
  if (!peopleList.length) {
    req.flash("error", "Please Search Again");
    res.redirect('/');
  } else {
    let person = peopleList.find(data => data.id == id);
    let url = `https://api.themoviedb.org/3/person/${id}?api_key=${tmdbApiKey}&language=en-US`;
    request(url, (error, resp, body) => {
      if (!error && resp.statusCode == 200) {
        let data = JSON.parse(body);
        person.birthday = data.birthday;
        person.deathday = data.deathday;
        person.biography = data.biography;
        person.birthplace = data.place_of_birth;
        person.imdbid = data.imdb_id;
        person.homepage = data.homepage;
        // console.log(person);
        res.render("personDetails", {
          person: person
        });
      }
    });
  }
});

router.get("/moviedetails/:clickedmovieimdbid", (req, res) => {
  let clickedmovieimdbid = req.params.clickedmovieimdbid;

  if (req.user) {
    let watchlist = req.user.watchlist;
    var foundInWatchlist = false;
    for (let i = 0; i < watchlist.length; i++) {
      let imdbId = watchlist[i].imdbId;
      if (imdbId === clickedmovieimdbid) {
        foundInWatchlist = true;
        break;
      }
    }
    let likedMovielist = req.user.likedMovielist;
    var foundInLikedMovielist = false;
    for (let i = 0; i < likedMovielist.length; i++) {
      let imdbId = likedMovielist[i].imdbId;
      if (imdbId === clickedmovieimdbid) {
        foundInLikedMovielist = true;
        break;
      }
    }
    let dislikedMovielist = req.user.dislikedMovielist;
    var foundInDislikedMovielist = false;
    for (let i = 0; i < dislikedMovielist.length; i++) {
      let imdbId = dislikedMovielist[i].imdbId;
      if (imdbId === clickedmovieimdbid) {
        foundInDislikedMovielist = true;
        break;
      }
    }
    var rating = "Rate";
    let ratingList = req.user.rating;
    var foundInRatingList = false;
    for (let i = 0; i < ratingList.length; i++) {
      let imdbId = ratingList[i].imdbId;
      if (imdbId === clickedmovieimdbid) {
        foundInRatingList = true;
        rating = ratingList[i].rating;
        break;
      }
    }
  }

  // Function to Convert Runtime from Minutes to Hours:Minutes
  function convertRuntime(a) {
    let hours = Math.trunc(a / 60);
    let minutes = a % 60;
    let time;
    if (hours != 0 && minutes != 0) {
      time = hours + "h " + minutes + "min";
    } else if (hours == 0) {
      time = minutes + "min";
    } else if (minutes == 0) {
      time = hours + "h ";
    }
    return time;
  }

  let options = {
    url: `http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${clickedmovieimdbid}`,
    json: true
  };

  rp(options)
    .then(data => {
      let clickedmovie = {};
      // console.log(data)
      clickedmovie = {
        title: data.Title,
        year: data.Year,
        rated: data.Rated,
        released: data.Released,
        genre: data.Genre,
        director: data.Director,
        writer: data.Writer,
        actors: data.Actors,
        plot: data.Plot,
        language: data.Language,
        country: data.Country,
        awards: data.Awards,
        poster: data.Poster,
        ratings: data.Ratings,
        metascore: data.Metascore,
        imdbrating: data.imdbRating,
        imdbvotes: data.imdbVotes,
        imdbid: data.imdbID,
        type: data.Type,
        dvd: data.DVD,
        // boxoffice1: data.BoxOffice,
        runtime1: data.Runtime,
        website: data.Website
      };

      let findTmdbIdUrl = `https://api.themoviedb.org/3/find/${clickedmovieimdbid}?api_key=${tmdbApiKey}&language=en-US&external_source=imdb_id`;
      request(findTmdbIdUrl, (err, resp, body) => {
        data = JSON.parse(body);
        let tmdbId, flagMovie;
        if (data.movie_results.length > 0) {
          flagMovie = true;
          tmdbId = data.movie_results[0].id;
          searchTrailerLinkUrl = `http://api.themoviedb.org/3/movie/${tmdbId}?api_key=${tmdbApiKey}&append_to_response=videos`;
        } else if (data.tv_results.length > 0) {
          flagMovie = false;
          tmdbId = data.tv_results[0].id;
          searchTrailerLinkUrl = `http://api.themoviedb.org/3/tv/${tmdbId}?api_key=${tmdbApiKey}&append_to_response=videos`;
        }
        // console.log(tmdbId);

        //  get trailer ===========================================================
        request(searchTrailerLinkUrl, (err, resp, body) => {
          full_data = JSON.parse(body);
          // console.log(full_data);
          // console.log(full_data.videos.results);
          let youtubeId = null;
          if (full_data.videos.results.length) {
            youtubeId = full_data.videos.results[0].key;
          }

          youtubeTrailerObject = full_data.videos.results.find(
            x => x.type === "Trailer"
          );
          if (youtubeTrailerObject) {
            youtubeId = youtubeTrailerObject.key;
          }

          if (youtubeId)
            trailerlink = `https://www.youtube.com/watch?v=${youtubeId}`;
          else trailerlink = "";

          if (flagMovie) {
            clickedmovie.boxoffice = full_data.revenue;
            runtime = full_data.runtime ?
              full_data.runtime.toString() :
              full_data.runtime;
            clickedmovie.runtime = runtime;
          }
          clickedmovie.tagline = full_data.tagline;
          clickedmovie.production = full_data.production_companies;
          clickedmovie.status = full_data.status;
          // console.log(clickedmovie);

          // // get recommendations =========================================================

          // let recommendationUrl = `https://api.themoviedb.org/3/movie/${tmdbId}/recommendations?api_key=${tmdbApiKey}&language=en-US&page=1`;
          // request(recommendationUrl, (err, resp, body) => {

          //   let data = JSON.parse(body);
          //   let recommendedMovies = data.results;

          // });

          res.render("moviedetails", {
            movie: clickedmovie,
            // recommendedMovies: recommendedMovies,
            trailerlink: youtubeId,
            display: convertRuntime,
            foundInWatchlist: foundInWatchlist,
            foundInLikedMovielist: foundInLikedMovielist,
            foundInDislikedMovielist: foundInDislikedMovielist,
            foundInRatingList: foundInRatingList,
            rating: rating,
            flagMovie: flagMovie,
            tmdbId: tmdbId,
          });

        });
      });
    })
    .catch(err => console.log(err));
});

module.exports = router;