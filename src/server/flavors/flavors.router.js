const router = require("express").Router();
const controller = require("./flavors.controller");

router.route("/").get(controller.list).post(controller.create);
router.route("/:flavorId").get(controller.read).put(controller.update).delete(controller.destroy);

module.exports = router;