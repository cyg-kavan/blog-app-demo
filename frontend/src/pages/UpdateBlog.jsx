import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogForm from "../components/BlogForm";

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

        setTitle(response.data.fetchBlog.title);
        setContent(response.data.fetchBlog.content);
      } catch (error) {
        console.error("Update blog error", error.message);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleUpdateBlog = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(
        `http://localhost:8000/api/blogs/${blogId}`,
        { title, content },
        { withCredentials: true }
      );

      alert("Blog Updated successfully");
      navigate("/my-blogs");
    } catch (error) {
      console.error("Create blog error", error.message);
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
