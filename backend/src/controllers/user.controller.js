const { default: mongoose } = require("mongoose");
const Blog = require("../models/blog.model");
const Request = require("../models/request.model");
const User = require("../models/user.model");

const { createSecretToken } = require("../utils/generateToken");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // if(!(
    //     req.body.name &&
    //     req.body.email &&
    //     req.body.password
    // ))
    // {
    //     return res.status(400).send("All inputs are required");
    // }

    if (!(name && email && password)) {
      return res.status(400).send("All inputs are required");
    }

    const isEmail = (email) => {
      const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      return emailFormat.test(email);
    };
    if (!isEmail(email)) {
      return res.status(400).send({ message: "Invalid email format." });
    }

    const isStrongPassword = (password) => {
      if (password.length < 6) {
        return false;
      }

      const digit = /[0-9]/;
      const uppercase = /[A-Z]/;
      const lowercase = /[a-z]/;
      const nonAlphanumeric = /[^0-9A-Za-z]/;

      return [digit, uppercase, lowercase, nonAlphanumeric].every((re) =>
        re.test(password)
      );
    };
    if (!isStrongPassword(password)) {
      return res.status(400).send({
        message:
          "Password must contain atleast 6 characters contain at least one digit, one uppercase letter, one lowercase letter, and one special character.",
      });
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res
        .status(409)
        .send({ message: "User already exist, Please Login." });
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      path: "/",
      expires: new Date(Date.now() + 86400000),
      httpOnly: true,
    });

    console.log("Cookie set successfully");

    return res.status(201).json({
      message: "Signup Or Registration successful",
      user,
    });
  } catch (error) {
    console.log("Got an error in signup", error);
    res.status(500).send("Internal Server Error");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({ message: "All input is required" });
    }

    const user = await User.findOne({ email });
    if (!(user && (await bcrypt.compare(password, user.password)))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      // domain: process.env.FRONTEND_URL,
      path: "/",
      expires: new Date(Date.now() + 86400000),
      httpOnly: true,
    });

    res.json({ token });
  } catch (error) {
    console.log("Got an error in login", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, password } = req.body;

    const updateData = {};

    if (name) updateData.name = name;

    // if(password) {
    //     if(password.length < 6) {
    //         return res.status(400).send({ message: "Password must be atleast 6 characters long"});
    //     }

    //     const salt = 10;
    //     updateData.password = await bcrypt.hash(password, salt);
    // }

    if (password) {
      const isStrongPassword = (password) => {
        if (password.length < 6) {
          return false;
        }

        const digit = /[0-9]/;
        const uppercase = /[A-Z]/;
        const lowercase = /[a-z]/;
        const nonAlphanumeric = /[^0-9A-Za-z]/;

        return [digit, uppercase, lowercase, nonAlphanumeric].every((re) =>
          re.test(password)
        );
      };
      if (!isStrongPassword(password)) {
        return res.status(400).send({
          message:
            "Password must contain atleast 6 characters contain at least one digit, one uppercase letter, one lowercase letter, and one special character.",
        });
      }

      const salt = 10;
      updateData.password = await bcrypt.hash(password, salt);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

    //findbyId and then save
    // const user = await User.findById(userId);

    // if (!user) {
    //     return res.status(404).json({ message: "User not found" });
    // }

    // if (name) {
    //     user.name = name;
    // }

    // if(password) {
    //     if(password.length < 6) {
    //         return res.status(400).send({ message: "Password must be atleast 6 characters long"});
    //     }

    //     const salt = 10;
    //     user.password = await bcrypt.hash(password, salt);
    // }

    // await user.save();

    // res.json({
    //     message: "Profile updated successfully",
    //     user: user,
    // });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkAuth = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      path: "/",
      // expires: new Date(Date.now() + 86400000),
      httpOnly: true,
    });

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const sendRequest = async (req, res) => {
  const userId = req.user.id;
//   const blogId = req.params.blogId;
  const { request_type, blogId } = req.body;

  try {
    if (!request_type) {
      return res.status(400).json({ message: "Request type is required" });
    }

    // if (!(request_type === "Change Role" || request_type === "Publish Blog")) {
    //   return res.status(400).json({ message: "Request type is not valid" });
    // }

    const validRequest = ["Change Role", "Publish Blog"];
    if (!validRequest.includes(request_type)) {
      return res.status(400).json({ message: "Request type is not valid" });
    }

    if (request_type === "Publish Blog") {
      if (!blogId) {
        return res.status(400).json({ message: "Blog Id is required" });
      }

      const verifyAuthor = await Blog.findOne({ _id: blogId, author: userId });

      if (!verifyAuthor) {
        return res.status(400).json({ message: "Blog not found or unauthorized" });
      }
    }

    const query = {
        user_id: userId,
        request_type,
        status: "Pending",
        blog_id: blogId || null
    }
    
    // if(request_type === "Publish Blog") {
    //     duplicateRequestQuery.blog_id = blogId;
    // }

    const duplicateRequest = await Request.findOne(query);

    if (duplicateRequest) {
      return res.status(409).json({ message: "Request already exist" });
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
        request: createRequest,
        message: "Request sent successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMyRequests = async (req, res) => {
  const userId = req.user.id;

  const requests = await Request.find({ user_id: userId })
    .populate("user_id", "name email")
    .populate("blog_id", "title")

  return res.status(200).json({
    requests,
    message: "Your requests have been fetched"
  })
}

module.exports = { signup, login, updateProfile, checkAuth, logout, sendRequest, getMyRequests };
