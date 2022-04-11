const router = require("express").Router();
const controller = require("./auth.controller")

router.route("/").get(controller.list).post(controller.createAccount)
router.route("/logout").get(controller.logout)
router.route("/admin").get(controller.adminCheck)
router.route("/:employeeId").get(controller.read).put(controller.update).delete(controller.destroy);
router.route("/:employeeId/reset").put(controller.resetPassword)

module.exports = router;