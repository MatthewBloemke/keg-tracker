const router = require("express").Router();
const controller = require("./kegs.controller");

router.route("/").get(controller.list).post(controller.create)
router.route('/verify').post(controller.verifyKeg)
router.route("/:kegId").get(controller.read).put(controller.update).delete(controller.destroy)
router.route("/track/:kegId").put(controller.track)

module.exports = router;