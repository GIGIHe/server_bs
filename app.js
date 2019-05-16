var createError = require("http-errors");
var express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
var mongooseConnection = require("./model/config");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
// var svgRouter = require('./routes/yzm');

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "hejinjin2019",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60000 * 60 * 24 *7 },
    store: new MongoStore({
      mongooseConnection: mongooseConnection
      // ttl: 7 * 24 * 60 * 60 // = 7 days. Default
    })
  })
);
app.use("/", indexRouter);
// app.use('/svg', svgRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
