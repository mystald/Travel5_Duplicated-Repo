var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const jwtService = require("./services/jwtService");
const db = require("./models/db");


var indexRouter = require("./api/index");
const hotelRouter = require("./api/hotel");
const userRouter = require("./api/user");
const adminRouter = require("./api/admin");
const transactionRouter = require("./api/transaction");

var app = express();

db()
  .then(() => console.log("Koneksi database telah sukses"))
  .catch((err) => `Error koneksi database ${err.message}`);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(process.cwd(), "public")));

//app.use("/", indexRouter);
app.use("/hotel", hotelRouter);
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/fe/transaction", transactionRouter);
app.use("/transaction",jwtService.authenticateTokenUser, transactionRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

module.exports = app;
