const express = require("express");
const passport = require("passport");
const helmet = require("helmet");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cookieParser = require("cookie-parser");

const flash = require("connect-flash");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const connection = require("./config/db");
require("./config/passportConfig");
const app = express();
// Database connection
connection();
// Enable CORS middleware

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });
app.use(helmet());
app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
const PORT = process.env.PORT || 5000;
const store = new MongoDBStore({
  uri: process.env.DB,
  collection: "sessions",
});
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(authRoutes);
app.use(subscriptionRoutes);
app.use(express.json());
// Error handling middleware
// app.use((err, req, res, next) => {
//   console.log(`===> Error ===> ${err}`);
//   const statusCode = err.status || 500;
//   res.status(statusCode).json({
//     status: "error",
//     status: err.status || 500,
//     message: err.message,
//     type: err.type || "",
//     field: err.field || "",
//   });
// });
app.listen(PORT, () => {
  console.log(`Your app is running on port number: ${PORT}`);
});
