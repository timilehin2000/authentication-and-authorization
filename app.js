const express = require("express");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", userRoutes);

module.exports = app;
