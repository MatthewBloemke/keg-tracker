const router = require("express").Router();
const controller = require("./kegs.controller");

router.route("/").get(controller.list).post(controller.create).put(controller.update)
router.route('/verify').post(controller.verifyKeg)
router.route("/:kegName").get(controller.read).delete(controller.destroy)

module.exports = router;