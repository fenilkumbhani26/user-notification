const router = require("express").Router();
const { createUser, getUser, getAllUser, updateUser, forgotPasword, changePasword, deleteUser } = require("../controller/user_controller");

router.post("/", createUser);
router.get("/:userId", getUser);
router.get("/", getAllUser);
router.patch("/:userId", updateUser);
router.patch("/forgot-password/:userId", forgotPasword);
router.patch("/change-password/:userId", changePasword);
router.delete("/:userId", deleteUser);

module.exports = router;