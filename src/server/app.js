const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");
const notFound = require("./errors/notFound");
const errorHandler = require("./errors/errorHandler");
const cookieParser = require("cookie-parser");

const app = express();
const apiRouter = require('./apiRouter')

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/bundle.js", (req, res) => {
    res.sendFile(path.join(__dirname, `/out/bundle.js`));
});

app.use("/api", apiRouter);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
