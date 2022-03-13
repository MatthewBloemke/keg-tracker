const router = require("express").Router();
const controller = require("./auth.controller")

router.route("/").get(controller.list).post(controller.createAccount)
router.route("/:employeeId").get(controller.read).put(controller.update).delete(controller.destroy);

module.exports = router;