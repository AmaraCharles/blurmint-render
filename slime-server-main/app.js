var createError = require("http-errors");
var express = require("express");
const mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

var indexRouter = require("./routes/index");
var loginAuthRouter = require("./routes/auth/login");
var verifyAuthRouter = require("./routes/auth/verify-email");
var transactionsRouter = require("./routes/transactions");
var registerAuthRouter = require("./routes/auth/register");
// var kycAuthRouter = require("./routes/auth/kyc");
var fogortPasswordAuthRouter = require("./routes/auth/forgot-password");
var usersRouter = require("./routes/users");

var app = express();
var PORT = process.env.PORT || 8080;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", loginAuthRouter);
app.use("/auth", verifyAuthRouter);
app.use("/auth", registerAuthRouter);
app.use("/auth", fogortPasswordAuthRouter);
// app.use("/auth", kycAuthRouter);

app.use("/transactions", transactionsRouter);
const auctionsRouter = require('./routes/auctions');
app.use("/auctions", auctionsRouter);

// database setup
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", () => {
  console.log("Database connection error");
});

db.on("open", () => {
  console.log("Database connected successfully");
});

app.listen(PORT, () => {
  console.log("App is running on port: ", PORT);
});

module.exports = app;
