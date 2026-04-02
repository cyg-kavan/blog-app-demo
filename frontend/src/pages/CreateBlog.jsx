import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogForm from "../components/BlogForm";
import toast from "react-hot-toast";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleCreateBlog = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/blogs",
        { title, content },
        { withCredentials: true }
      );
      console.log("Create---", response.data)
      toast.success(response.data.message, { duration: 3000 });
      navigate("/my-blogs");
    } catch (error) {
      console.log("Create blog error: ", error.response?.data?.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <BlogForm
      title={title}
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      handleSubmit={handleCreateBlog}
      buttonText={"Create Blog"}
      headingText={"Create Your Blog"}
    />
  );
}
