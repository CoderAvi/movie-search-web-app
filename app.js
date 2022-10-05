const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  config = require("./config"),
  // fileUpload = require("express-fileupload"),
  flash = require("connect-flash");

rp = require("request-promise");

// ================================================================================
const mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  session = require("express-session"),
  FileStore = require("session-file-store")(session),
  cookieParser = require("cookie-parser"),
  User = require("./models/user"),
  middleware = require("./middleware");
// ================================================================================
const indexRouter = require("./routes/indexRouter"),
  userRouter = require("./routes/userRouter"),
  watchlistRouter = require("./routes/watchlistRouter"),
  likedMovielistRouter = require("./routes/likedMovielistRouter"),
  dislikedMovielistRouter = require("./routes/dislikedMovielistRouter"),
  searchRouter = require("./routes/searchRouter"),
  ratingRouter = require("./routes/ratingRouter");
// ================================================================================

app.set("view engine", "ejs");
app.use(express.static("public"));
// app.use(fileUpload());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser("Hello, This is my Secret Line"));

app.use(flash()); //for flash messages

// Mongoose connect ===============================================================
mongoose
  .connect(config.dbUrl, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected Successfully");
  })
  .catch(err => console.log(err));


// Express Session Setup ==========================================================
app.use(
  session({
    secret: "Hello, This is my Secret Line",
    resave: false,
    saveUninitialized: false,
    store: new FileStore(),
    cookie: {
      maxAge: 3600000,
      secure: false,
      httpOnly: true
    }
  })
);

// Passport Setup =================================================================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global variables Setup =========================================================
app.use((req, res, next) => {
  res.locals.currentUrl = req.originalUrl;
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Routers Setup ===================================================================

app.use("/", indexRouter);
app.use("/search", searchRouter);
app.use("/user", userRouter);
app.use("/user/myratings", middleware.isLoggedIn, ratingRouter);
app.use("/user/mywatchlist", middleware.isLoggedIn, watchlistRouter);
app.use("/user/likedmovielist", middleware.isLoggedIn, likedMovielistRouter);
app.use(
  "/user/dislikedmovielist",
  middleware.isLoggedIn,
  dislikedMovielistRouter
);

// =================================================================================

app.get("*", (req, res) => {
  res.send("<h1>Error 404!! Sorry, Page Not Found</h1>");
});

let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Movie App has started on port: ${port}`));
