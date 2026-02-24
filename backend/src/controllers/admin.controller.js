const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

const changeRole = async (req, res) => {
  try {
    const currentAdminId = req.user.id;
    const userRole = req.user.role;
    const userId = req.params.userId;
    const { role } = req.body;
    // console.log(req.body);
    // console.log(role);

    console.log("Current loggedIn userid:", currentAdminId);
    console.log("Userid to update role:", userId);

    if (!role) {
      return res.status(400).send({ message: "Role is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // const getuser = await User.findOne({ _id: userId });
    // console.log("Before:", getuser.role);

    // if(!getuser) {
    //     return res.status(404).send({ message: "User doesn't exist" });
    // }

    if (currentAdminId === userId) {
      return res.status(400).send({ message: "Admin can't update own role" });
    }

    const updatedRole = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );
    console.log("After:", updatedRole.role);

    if (!updatedRole) {
      return res
        .status(404)
        .send({ message: " User doesn't exist Or Error in updating role" });
    }

    return res.status(200).json({
      message: "Role updated successfully",
      user: updatedRole,
    });

    // return res.status(200).json({ message: "Admin authorized" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "This is not a valid role" });
  }
};

const publishBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { isPublished } = req.body;

    if (!isPublished) {
      return res.status(400).send({ message: "Publish status required" });
    }

    const updatedPublishStatus = await Blog.findByIdAndUpdate(
      blogId,
      { isPublished },
      { new: true, runValidators: true }
    );

    if (!updatedPublishStatus) {
      return res
        .status(404)
        .send({
          message: "Blog doesn't exist Or Error in updating publish status",
        });
    }

    return res.json({
      message: "Publish status updated successfully",
      blogs: updatedPublishStatus,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "This is not a valid status" });
  }
};

module.exports = { changeRole, publishBlog };
