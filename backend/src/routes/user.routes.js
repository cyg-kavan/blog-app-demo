const express = require("express");
const router = express.Router();

const { signup, login, updateProfile, checkAuth, logout } = require("../controllers/user.controller.js")
const authentication = require("../middlewares/auth.middleware.js");
const authorizeRoles = require("../middlewares/rbac.middleware.js");

router.get("/check-auth", authentication, checkAuth)
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authentication, logout);
router.patch("/profile", authentication, updateProfile);

module.exports = router;