const express = require("express");
const router = express.Router();

const { signup, login, updateProfile } = require("../controllers/user.controller.js")
const authentication = require("../middlewares/auth.middleware.js");

router.post("/signup", signup);
router.post("/login", login);
router.patch("/profile", authentication, updateProfile);

module.exports = router;