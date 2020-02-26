const express = require("express");
const path = require("path");

var PORT = process.env.PORT || 8080;

const app = express();

// express middleware
app.use(express.static(path.join(__dirname, 'client/build')));

// Parse application body as JSON.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import routes and give the server access to them.
var routes = require("./routes/routes.js");
app.use(routes);

app.listen(PORT, () => {console.log(`Server Listening on http://localhost:${PORT}`)});