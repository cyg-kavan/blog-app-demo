import React from 'react'
import BlogCard from './BlogCard'

export default function BlogListGrid({ blogs }) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-25 my-10'>
        {blogs.map((blog) => (
            <BlogCard key={blog._id} {...blog}/>
        ))}
    </div>
  )
}
