const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");

const notFound = require("./errors/notFound");
const errorHandler = require("./errors/errorHandler");

const kegsRouter = require("./kegs/kegs.router");
const distributorsRouter = require("./distributors/distributors.router");
const authRouter = require("./auth/auth.router")

const app = express();

app.use(cors());
app.use(express.json());

app.use("/employees", authRouter)
app.use("/kegs", kegsRouter);
app.use("/distributors", distributorsRouter);

app.use(notFound)
app.use(errorHandler)

module.exports = app;
