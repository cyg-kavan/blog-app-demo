import React from 'react'

export default function BlogCard({ title, author, createdAt }) {
  
  const dateObj = new Date(createdAt);
  const customFormattedDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
  
  return (
    <div className='flex flex-col bg-white w-70 h-80 p-4 rounded-3xl shadow-lg hover:shadow-lg hover:shadow-gray-400'>
        <img className='h-40 object-cover rounded-lg' src="https://static.vecteezy.com/system/resources/thumbnails/053/733/048/small/modern-car-captured-in-close-upgraphy-with-precision-and-innovation-free-photo.jpg" alt="Image" />

        <h2 className='pt-1.5 font-bold text-lg truncate'>{title}</h2>
        <div className='flex justify-between text-sm mt-2 mb-8'>
          {(author && author.name) &&
            <span>{author.name}</span>
          }
            <span>{customFormattedDate}</span>
        </div>
        
        <button className='bg-black hover:bg-gray-900 text-white w-full py-1 rounded-3xl'>Read</button>
    </div>
  )
}