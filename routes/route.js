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
router.post("/create-blog", authentication, createBlog);
router.patch("/update-blog/:blogId", authentication, updateBlog);
router.delete("/delete-blog/:blogId", authentication, deleteBlog);
router.get("/show-blog", authentication, showBlog);
router.get("/blog-listing", blogListing);

// router.get("/logout", (req, res) => {
//     res.clearCookie("token");
//     res.json({ message: "Logged out" });
// });

module.exports = router;
