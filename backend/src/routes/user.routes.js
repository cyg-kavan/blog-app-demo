const express = require("express");
const router = express.Router();

const { signup, login, updateProfile, checkAuth, logout, sendRequest, getMyRequests } = require("../controllers/user.controller.js")
const authentication = require("../middlewares/auth.middleware.js");
const authorizeRoles = require("../middlewares/rbac.middleware.js");

router.get("/check-auth", authentication, checkAuth)
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authentication, logout);
router.patch("/profile", authentication, updateProfile);
router.post("/request", authentication, sendRequest);
router.get("/my-requests", authentication, authorizeRoles('request','view_own'), getMyRequests);

module.exports = router;