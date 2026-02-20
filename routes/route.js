const express = require("express");

const login = require("../controller/login.js");
const createUser = require("../controller/signup.js");
const authentication = require("../middlewares/auth.js");
const updateProfile = require("../controller/user.controller.js");
const createBlog = require("../controller/createblog.js");
const { Blog } = require("../database/schema/Schema");
const updateBlog = require("../controller/updateblog.js");
const deleteBlog = require("../controller/deleteblog.js");
const showBlog = require("../controller/showblog.js");
const blogListing = require("../controller/bloglisting.js");
const changeRole = require("../controller/changeUserRole.js");
const authorizeRoles = require("../middlewares/rbac.js");
const publishBlog = require("../controller/publishBlog.js");

const router = express.Router();

router.get("/auth-user", authentication, (req, res) => {
    res.json({
        message: "Auth working",
        user: req.user
    });
});

router.get("/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find({});
        if(!blogs) {
            return res.status(404).json({
                message: "Blogs not found"
            })
        }
        res.json(blogs)
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

router.get("/blogs/:blogId", async (req, res) => {
    console.log(req.params.blogId);
    try {
        const blogbyId = await Blog.findById(req.params.blogId);
        if(!blogbyId) {
            return res.status(404).json({
                message: "Blog not found"
            })
        }
        res.json(blogbyId);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

router.post("/signup", createUser);
router.post("/login", login);
router.patch("/update-profile", authentication, updateProfile);
// router.post("/create-blog", authentication, authorizeRoles(['admin', 'author']), createBlog);
router.post("/create-blog", authentication, authorizeRoles('blog', 'add'), createBlog);
// router.patch("/update-blog/:blogId", authentication, authorizeRoles(['admin', 'author']), updateBlog);
router.patch("/update-blog/:blogId", authentication, authorizeRoles('blog', 'edit'), updateBlog);
// router.delete("/delete-blog/:blogId", authentication, authorizeRoles(['admin', 'author']), deleteBlog);
router.delete("/delete-blog/:blogId", authentication, authorizeRoles('blog', 'delete'), deleteBlog);
router.get("/show-blog", authentication, showBlog);
router.get("/blog-listing", blogListing);
router.patch("/admin/users/:userId/role", authentication, authorizeRoles('user', 'edit'), changeRole);
router.patch("/admin/blogs/:blogId/publish", authentication, authorizeRoles('blog', 'publish'), publishBlog);

// router.get("/logout", (req, res) => {
//     res.clearCookie("token");
//     res.json({ message: "Logged out" });
// });

module.exports = router;