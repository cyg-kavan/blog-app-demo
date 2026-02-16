const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  role: {
    type: String,
    enum: ['admin','author','viewer'],
    default: 'viewer'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});
const User = mongoose.model("User", userSchema);

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  },
  { timestamps: true }
);

// blogSchema.index({ author: 1, title: 1 }, { unique: true })
const Blog = mongoose.model("Blog", blogSchema);

module.exports = { User, Blog };
