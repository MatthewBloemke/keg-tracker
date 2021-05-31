const router = require("express").Router();
const controller = require("./auth.controller")

router.route("/").get(controller.list).post(controller.createAccount)
router.route("/login").post(controller.login)

module.exports = router;