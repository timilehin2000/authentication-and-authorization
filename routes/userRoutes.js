const express = require("express");
const userController = require("../controllers/user");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", userController.userSignup);
router.post("/login", userController.userLogin);
router.get("/admin", auth, userController.becomeAdmin);

module.exports = router;
