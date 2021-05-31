const router = require("express").Router();
const controller = require("./auth.controller")

router.route("/").get(controller.list).post(controller.createAccount)

module.exports = router;