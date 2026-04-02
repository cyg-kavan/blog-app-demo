const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

const changeRole = async (req, res) => {
  try {
    const currentAdminId = req.user.id;
    const userId = req.params.userId;
    const { role } = req.body;

    console.log("Current loggedIn userid:", currentAdminId);
    console.log("Userid to update role:", userId);

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // const getuser = await User.findOne({ _id: userId });
    // console.log("Before:", getuser.role);

    // if(!getuser) {
    //     return res.status(404).json({ message: "User doesn't exist" });
    // }

    if (currentAdminId === userId) {
      return res.status(400).json({
        success: false,
        message: "Admin can't update own role",
      });
    }

    const updatedRole = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );
    console.log("After:", updatedRole.role);

    if (!updatedRole) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist Or Error in updating role",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: updatedRole,
    });

    // return res.status(200).json({ message: "Admin authorized" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "This is not a valid role",
    });
  }
};

const publishBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { isPublished } = req.body;

    if (!isPublished) {
      return res.status(400).json({
        success: false,
        message: "Publish status required",
      });
    }

    const updatedPublishStatus = await Blog.findByIdAndUpdate(
      blogId,
      { isPublished },
      { new: true, runValidators: true }
    );

    if (!updatedPublishStatus) {
      return res.status(404).json({
        success: false,
        message: "Blog doesn't exist Or Error in updating publish status",
      });
    }

    return res.json({
      success: true,
      message: "Blog published successfully",
      data: updatedPublishStatus,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "This is not a valid status",
    });
  }
};

module.exports = { changeRole, publishBlog };
