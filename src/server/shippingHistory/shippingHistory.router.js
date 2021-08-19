const router = require("express").Router()
const controller = require("./shippingHistory.controller")

router.route("/").get(controller.list).post(controller.create)

module.exports = router;