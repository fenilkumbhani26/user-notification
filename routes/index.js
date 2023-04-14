const router = require("express").Router();

router.use("/user", require("./user_routes"));
router.use("/notification", require("./notification_routes"));

module.exports = router;