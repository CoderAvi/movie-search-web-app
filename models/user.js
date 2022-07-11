const mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");

var watchlistSchema = new mongoose.Schema({
  imdbId: String
}, {
  timestamps: true
});

var likedMovieListSchema = new mongoose.Schema({
  imdbId: String
}, {
  timestamps: true
});

var dislikedMovieListSchema = new mongoose.Schema({
  imdbId: String
}, {
  timestamps: true
});

var ratingSchema = new mongoose.Schema({
  imdbId: String,
  rating: Number
});

var UserSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  // image: String,
  admin: {
    type: Boolean,
    default: false
  },
  username: String,
  password: String,
  email: String,
  rating: [ratingSchema],
  watchlist: [watchlistSchema],
  likedMovielist: [likedMovieListSchema],
  dislikedMovielist: [dislikedMovieListSchema]
}, {
  timestamps: true
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);