import axios from "axios";
import React, { useEffect, useState } from "react";
import BlogListGrid from "../components/BlogListGrid";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/blogs/show-blog",
          { withCredentials: true }
        );
        console.log(response.data.showblogs);
        setBlogs(response.data.showblogs);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBlogs();
  }, []);
  return (
    <>
      <BlogListGrid blogs={blogs} />
    </>
  );
}
