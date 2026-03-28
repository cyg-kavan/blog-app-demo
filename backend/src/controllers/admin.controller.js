const Blog = require("../models/blog.model");
const Request = require("../models/request.model");
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
        .send({ message: "User doesn't exist Or Error in updating role" });
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
      return res.status(404).send({
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

const getUsersRequest = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("user_id", "name email")
      .populate("blog_id", "title content");

    return res.status(200).json({
      requests,
      message: "All user's requests are fetched",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const approveRequest = async (req, res) => {
  const requestId = req.params.requestId;
  const { status } = req.body;
  try {
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request doesn't exist" });
    }

    if (!["Approved", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (request.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "This request is already approved or cancelled" });
    }

    if (status === "Approved") {
      if (request.request_type === "Publish Blog") {
        const blog = await Blog.findById(request.blog_id);

        if (!blog) {
          return res.status(404).json({ message: "Blog not found" });
        }

        await Blog.findByIdAndUpdate(
          request.blog_id,
          { isPublished: true },
          { new: true, runValidators: true }
        );
      }

      if (request.request_type === "Change Role") {
        await User.findByIdAndUpdate(
          request.user_id,
          { role: "author" },
          { new: true, runValidators: true }
        );
      }

      request.status = "Approved";
      await request.save();
    }

    if (status === "Cancelled") {
      request.status = "Cancelled";
      await request.save();
    }

    return res.status(200).json({
      request,
      message: "Request resolved successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { changeRole, publishBlog, getUsersRequest, approveRequest };
