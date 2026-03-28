const express = require("express");
const router = express.Router();

const { changeRole, publishBlog, getUsersRequest, approveRequest } = require("../controllers/admin.controller")
const authentication = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/rbac.middleware");

router.patch("/users/:userId/role", authentication, authorizeRoles('user', 'edit'), changeRole);
router.patch("/blogs/:blogId/publish", authentication, authorizeRoles('blog', 'publish'), publishBlog);
router.get("/requests", authentication, authorizeRoles('request','view_all'), getUsersRequest);
router.patch("/requests/:requestId", authentication, authorizeRoles('request','approve'), approveRequest);

module.exports = router;