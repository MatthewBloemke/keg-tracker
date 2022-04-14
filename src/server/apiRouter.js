const express = require('express')

const apiRouter = express.Router();

const kegsRouter = require("./kegs/kegs.router");
const distributorsRouter = require("./distributors/distributors.router");
const authRouter = require("./auth/auth.router");
const loginRouter = require("./login/login.router");
const shippingRouter = require("./shippingHistory/shippingHistory.router")
const flavorsRouter = require("./flavors/flavors.router")
const fillingRouter = require('./fillingHistory/fillingHistory.router')
const jwt = require("express-jwt");




apiRouter.use("/login", loginRouter);
apiRouter.use(jwt({
    secret: process.env.SECRET,
    algorithms: ['sha1', 'RS256', 'HS256'],
    getToken: req => req.cookies.token
}));
apiRouter.use("/employees", authRouter);
apiRouter.use("/kegs", kegsRouter);
apiRouter.use("/distributors", distributorsRouter);
apiRouter.use("/shipping", shippingRouter)
apiRouter.use("/flavors", flavorsRouter)
apiRouter.use("/filling", fillingRouter)

module.exports = apiRouter;