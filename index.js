const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");
const api = process.env.API_URL;
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

app.use(express.json());
app.use(authJwt());
app.use(errorHandler);

const usersRoutes = require("./routes/users");

app.use(`${api}/users`, usersRoutes);

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Mongodb Database is connected...");
  })
  .catch((err) => {
    console.log("Their is an Erron", err);
  });

var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log("Express is working on port" + port);
});
