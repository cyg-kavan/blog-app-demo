const express = require("express");
const router = express.Router();

const { changeRole, publishBlog } = require("../controllers/admin.controller")
const authentication = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/rbac.middleware");

router.patch("/users/:userId/role", authentication, authorizeRoles('user', 'edit'), changeRole);
router.patch("/blogs/:blogId/publish", authentication, authorizeRoles('blog', 'publish'), publishBlog);

module.exports = router;