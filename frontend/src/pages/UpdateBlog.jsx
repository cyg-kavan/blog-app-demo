import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogForm from "../components/BlogForm";
import toast from "react-hot-toast";

export default function UpdateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const { blogId } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/blogs/${blogId}`,
          { withCredentials: true }
        );

        setTitle(response.data.data.title);
        setContent(response.data.data.content);
      } catch (error) {
        console.error("Update blog error", error.message);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleUpdateBlog = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `http://localhost:8000/api/blogs/${blogId}`,
        { title, content },
        { withCredentials: true }
      );

      toast.success(response.data.message, { duration: 3000 });
      navigate("/my-blogs");
    } catch (error) {
      console.error("Update blog error", error.response?.data?.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <BlogForm
      title={title}
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      handleSubmit={handleUpdateBlog}
      buttonText={"Update Blog"}
      headingText={"Update Your Blog"}
    />
  );
}
