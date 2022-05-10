const path = require("path");
const fs = require('fs')
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

fs.readdirSync('./src/server/out').forEach(file => {
    app.get(`/${file}`, (req, res) => {
        res.sendFile(path.join(__dirname, `/out/${file}`));
    });
});



app.use("/api", apiRouter);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
