require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const dbConnection = require("./config/database");
const cookieParser = require("cookie-parser");
const cookieEncrypter = require("cookie-encrypter");

var PORT = process.env.PORT || 8080;
var routes = require("./routes/routes.js"); 
require("./config/passport");

// express setup
var app = express();

// express middleware setup
app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.urlencoded({limit: "50mb", extended: true}));
app.use(express.json({limit: "50mb"}));

app.set("trust proxy", true);

// user session config
var sessionMW = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, 
  store: new MongoStore({ mongooseConnection: dbConnection.connection, collection: "sessions", autoRemove: "native" }),
  cookie: {
    maxAge: 1000 * (60 * 60),
    httpOnly: false
  },
});

// only use express session middleware on these routes
app.all(["/", "/login", "/logout", "/userSession"], sessionMW);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(cookieEncrypter(process.env.COOKIE_SECRET));

// Import routes and give the server access to them.
app.use(routes);

app.listen(PORT, () => {console.log(`Server Listening on http://localhost:${PORT}`)});