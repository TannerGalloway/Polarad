require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const dbConnection = require("./config/database");

var PORT = process.env.PORT || 8080;
var routes = require("./routes/routes.js"); 
require("./config/passport");

// express setup
var app = express();

app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("trust proxy", true);

// user session config
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true, 
  store: new MongoStore({ mongooseConnection: dbConnection.connection, collection: "sessions" }),
  cookie: {
    maxAge: 1000 * 60,
    httpOnly: false,
  },
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Import routes and give the server access to them.
app.use(routes);

app.listen(PORT, () => {console.log(`Server Listening on http://localhost:${PORT}`)});