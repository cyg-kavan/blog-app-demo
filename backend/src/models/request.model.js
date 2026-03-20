const mongoose = require("mongoose");

const requestSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    request_type: {
      type: String,
      enum: ["Change Role", "Publish Blog"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Approved", "Pending", "Cancelled"],
      default: "Pending",
      required: true,
    },
    blog_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
