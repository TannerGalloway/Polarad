require("dotenv").config();
const mongoose = require("mongoose");
var db = mongoose.connection;

// connect to database
mongoose.connect(process.env.MONGO_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected to Database!");
});

// schema for users
const UserSchema = mongoose.Schema({
    username: String,
    password: String
});

// export schema and db connection
module.exports.model = mongoose.model("User", UserSchema); 
module.exports.connection = db;