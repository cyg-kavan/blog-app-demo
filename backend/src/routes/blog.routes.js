const express = require("express");
const router = express.Router();

const { createBlog, updateBlog, deleteBlog, showBlog, blogListing } = require("../controllers/blog.controller")
const authentication = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/rbac.middleware");

router.get("/", blogListing);
router.get("/show-blog", authentication, showBlog);
// router.post("/create-blog", authentication, authorizeRoles(['admin', 'author']), createBlog);
router.post("/", authentication, authorizeRoles('blog', 'add'), createBlog);
// router.patch("/update-blog/:blogId", authentication, authorizeRoles(['admin', 'author']), updateBlog);
router.patch("/:blogId", authentication, authorizeRoles('blog', 'edit'), updateBlog);
// router.delete("/delete-blog/:blogId", authentication, authorizeRoles(['admin', 'author']), deleteBlog);
router.delete("/:blogId", authentication, authorizeRoles('blog', 'delete'), deleteBlog);

module.exports = router;