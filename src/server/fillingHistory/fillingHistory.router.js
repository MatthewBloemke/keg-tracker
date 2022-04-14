const router = require("express").Router()
const controller = require("./fillingHistory.controller")

router.route("/").get(controller.list).post(controller.create)
router.route("/:fillingId").put(controller.update).get(controller.read).delete(controller.destroy)

module.exports = router;