const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");
const notFound = require("./errors/notFound");
const errorHandler = require("./errors/errorHandler");

const kegsRouter = require("./kegs/kegs.router");
const distributorsRouter = require("./distributors/distributors.router");
const authRouter = require("./auth/auth.router");
const loginRouter = require("./login/login.router");
const cookieParser = require("cookie-parser");
const jwt = require("express-jwt");

const app = express();
const apiRouter = express.Router();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/bundle.js", (req, res) => {
    res.sendFile(path.join(__dirname, `/out/bundle.js`));
});

apiRouter.use("/login", loginRouter); //todo: add an actual way to exclude /login from jwt
apiRouter.use(jwt({
    secret: process.env.SECRET,
    algorithms: ['sha1', 'RS256', 'HS256'],
    getToken: req => req.cookies.token
}));
apiRouter.use("/employees", authRouter);
apiRouter.use("/kegs", kegsRouter);
apiRouter.use("/distributors", distributorsRouter);

app.use("/api", apiRouter);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
