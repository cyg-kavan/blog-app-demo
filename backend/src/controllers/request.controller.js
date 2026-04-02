const Blog = require("../models/blog.model");
const Request = require("../models/request.model");
const User = require("../models/user.model");

const sendRequest = async (req, res) => {
  const userId = req.user.id;
  //   const blogId = req.params.blogId;
  const { request_type, blogId } = req.body;

  try {
    if (!request_type) {
      return res.status(400).json({
        success: false,
        message: "Request type is required",
      });
    }

    // if (!(request_type === "Change Role" || request_type === "Publish Blog")) {
    //   return res.status(400).json({ message: "Request type is not valid" });
    // }

    const validRequest = ["Change Role", "Publish Blog"];
    if (!validRequest.includes(request_type)) {
      return res.status(400).json({
        success: false,
        message: "Request type is not valid",
      });
    }

    if (request_type === "Publish Blog") {
      if (!blogId) {
        return res.status(400).json({
          success: false,
          message: "Blog Id is required",
        });
      }

      const verifyAuthor = await Blog.findOne({ _id: blogId, author: userId });

      if (!verifyAuthor) {
        return res.status(400).json({
          success: false,
          message: "Blog not found or unauthorized",
        });
      }
    }

    const query = {
      user_id: userId,
      request_type,
      status: "Pending",
      blog_id: blogId || null,
    };

    // if(request_type === "Publish Blog") {
    //     duplicateRequestQuery.blog_id = blogId;
    // }

    const duplicateRequest = await Request.findOne(query);

    if (duplicateRequest) {
      return res.status(409).json({
        success: false,
        message: "Request already exist",
      });
    }

    // const requestData = {
    //   user_id: userId,
    //   request_type,
    // };

    // if (request_type === "Publish Blog") {
    //   requestData.blog_id = blogId;
    // }

    const createRequest = await Request.create(query);

    if (createRequest) {
      return res.status(201).json({
        success: true,
        data: createRequest,
        message: "Request sent successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await Request.find({ user_id: userId })
      .populate("user_id", "name email")
      .populate("blog_id", "title");

    return res.status(200).json({
      success: true,
      data: requests,
      message: "Your requests have been fetched",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getUsersRequest = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("user_id", "name email")
      .populate("blog_id", "title content");

    return res.status(200).json({
      success: true,
      message: "All user's requests are fetched",
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const approveRequest = async (req, res) => {
  const requestId = req.params.requestId;
  const { status } = req.body;
  try {
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request doesn't exist",
      });
    }

    if (!["Approved", "Cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "This request is already approved or cancelled",
      });
    }

    if (status === "Approved") {
      if (request.request_type === "Publish Blog") {
        const blog = await Blog.findById(request.blog_id);

        if (!blog) {
          return res.status(404).json({
            success: false,
            message: "Blog not found",
          });
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
      success: true,
      message: "Request resolved successfully",
      request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  sendRequest,
  getMyRequests,
  getUsersRequest,
  approveRequest,
};
