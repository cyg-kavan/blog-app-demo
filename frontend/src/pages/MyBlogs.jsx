import axios from "axios";
import React, { useEffect, useState } from "react";
import BlogListGrid from "../components/BlogListGrid";
import BlogFilters from "../components/BlogFilters";
import { useAuth } from "../contexts/useAuth";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [status, setStatus] = useState("all");

  const { user } = useAuth();

  useEffect(() => {
    const fetchBlogs = async () => {
      const [sortby, order] = sort.split("-");
      // console.log(sortby,order);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/blogs/my-blogs?search=${search.trim()}&sort=${sortby}&order=${order}&page=1&limit=10&status=${status}`,
          { withCredentials: true }
        );
        console.log(response.data.blogs);
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error(error);
      }
    };

    if (user.role !== "viewer") {
      fetchBlogs();
    }
  }, [search, sort, status]);

  const handleDeleteBlog = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/blogs/${id}`, {
        withCredentials: true,
      });
      alert("Blog Deleted Successfully");
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  const handleChangeRoleRequest = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/users/request",
        { request_type: "Change Role" },
        { withCredentials: true }
      );
      alert("Role change request submitted successfully");
    } catch (error) {
      console.error("Change Role Error: ", error);
    }
  };

  const handlePublishBlogRequest = async (blogId) => {
    try {
      await axios.post(
        "http://localhost:8000/api/users/request",
        {
          request_type: "Publish Blog",
          blogId: blogId,
        },
        { withCredentials: true }
      );
      alert("Publish Blog request submitted successfully");
    } catch (error) {
      console.error("Publish Blog Error: ", error);
    }
  };

  const handlePublishBlog = async (blogId, isPublished) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/admin/blogs/${blogId}/publish`,
        { isPublished },
        { withCredentials: true }
      );
      setBlogs((prev) => prev.map(b => b._id === blogId ? {...b, isPublished} : b))
      alert("Blog published successfully");
    } catch (error) {
      console.error("Publish Blog Error: ", error);
    }
  };

  return (
    <>
      {user.role !== "viewer" ? (
        <>
          <BlogFilters
            search={search}
            setSearch={setSearch}
            sort={sort}
            setSort={setSort}
            status={status}
            setStatus={setStatus}
          />

          <BlogListGrid
            blogs={blogs}
            handleDeleteBlog={handleDeleteBlog}
            handlePublishBlogRequest={handlePublishBlogRequest}
            handlePublishBlog={handlePublishBlog}
          />
        </>
      ) : (
        <div className="flex flex-col justify-center items-center min-h-screen px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col gap-3 justify-evenly bg-white w-70 h-80 p-4 rounded-md shadow-lg hover:shadow-lg hover:shadow-gray-400">
            <h2 className=" text-center text-lg font-bold tracking-tight">
              Your current role is "Viewer". You can't write blogs yet.
            </h2>
            <h2 className="text-center text-lg font-semibold tracking-tight">
              Press this below button for request of change role to "Author".
            </h2>
            <div>
              <button
                onClick={handleChangeRoleRequest}
                className="bg-black hover:bg-gray-900 text-white text-lg rounded-md font-semibold w-full py-1 cursor-pointer"
              >
                Change Role
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
