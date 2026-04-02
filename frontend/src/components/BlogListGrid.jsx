import React from "react";
import BlogCard from "./BlogCard";

export default function BlogListGrid({
  blogs,
  handleDeleteBlog,
  handlePublishBlogRequest,
  handlePublishBlog
}) {

  if(blogs.length === 0) {
    return (
      <div className="flex justify-center items-center h-100 text-2xl font-semibold pt-20">
        You haven't written any blogs Or There are no blogs for this filter
      </div>
    )
  }

  return (
    // <div className='bg-gray-300 max-w-[180vh] mx-30 rounded-2xl p-10 mt-20'>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-25 my-10">
      {blogs.map((blog) => (
        <BlogCard
          key={blog._id}
          {...blog}
          handleDeleteBlog={handleDeleteBlog}
          handlePublishBlogRequest={handlePublishBlogRequest}
          handlePublishBlog={handlePublishBlog}
        />
      ))}
    </div>
    // </div>
  );
}
