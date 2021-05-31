const router = require("express").Router();
const controller = require("./distributors.controller");

router.route("/").get(controller.list).post(controller.create);
router.route("/:distributorId").get(controller.read).put(controller.update).delete(controller.destroy);

module.exports = router;