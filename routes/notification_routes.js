const router = require("express").Router();
const { sendNotification, getNotification, getAllNotification, updateNotification, deleteNotification } = require("../controller/notification_controller");

router.post("/", sendNotification);
router.get("/:notificationId", getNotification);
router.get("/", getAllNotification);
router.patch("/:notificationId", updateNotification);
router.delete("/:notificationId", deleteNotification);

module.exports = router;