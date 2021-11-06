const router = require("express").Router()
const controller = require("./shippingHistory.controller")

router.route("/").get(controller.list).post(controller.create)
router.route("/:shippingId").put(controller.update).get(controller.read).delete(controller.destroy)

module.exports = router;