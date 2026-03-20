import React, { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "./Modal";

export default function BlogCard({
  title,
  content,
  author,
  createdAt,
  _id,
  handleDeleteBlog,
  isPublished,
  handlePublishBlog,
}) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // const { blogId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dateObj = new Date(createdAt);
  const customFormattedDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col bg-white w-70 h-auto p-4 rounded-md shadow-lg hover:shadow-lg hover:shadow-gray-400">
      <img
        className="h-40 object-cover rounded-lg"
        src="https://static.vecteezy.com/system/resources/thumbnails/053/733/048/small/modern-car-captured-in-close-upgraphy-with-precision-and-innovation-free-photo.jpg"
        alt="Image"
      />

      <div className="flex flex-col flex-1">
        <h2 className="pt-1.5 font-bold text-lg truncate">{title}</h2>
        <h3 className="pt-1.5 line-clamp-2">{content}</h3>
        <div className="flex justify-between text-sm font-semibold mt-2 mb-2">
          {author && author.name && <span>{author.name}</span>}
          <span>{customFormattedDate}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mt-auto">
        <div className="flex gap-1">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black hover:bg-gray-900 text-white font-semibold w-full py-1 rounded-md cursor-pointer"
          >
            Read
          </button>

          {isModalOpen && (
            <Modal onClose={() => setIsModalOpen(false)}>
              <div className="p-3">
                <h1 className="text-xl font-bold mb-5">{title}</h1>
                <div className="flex justify-between font-semibold mb-5">
                  <span>{author.name}</span>
                  <span>{customFormattedDate}</span>
                </div>
                <p className="text-md whitespace-pre-line">{content}</p>
              </div>
            </Modal>
          )}

          {user && location.pathname === "/my-blogs" && (
            <>
              <button
                onClick={() => navigate(`/update-blog/${_id}`)}
                className="bg-black hover:bg-gray-900 text-white font-semibold w-full py-1 rounded-md cursor-pointer"
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteBlog(_id)}
                className="bg-black hover:bg-gray-900 text-white font-semibold w-full py-1 rounded-md cursor-pointer"
              >
                Delete
              </button>
            </>
          )}
        </div>
        {!isPublished && (
          <button onClick={() => handlePublishBlog(_id)} className="bg-black hover:bg-gray-900 text-white font-semibold w-full py-1 rounded-md cursor-pointer">
            Publish Request
          </button>
        )}
      </div>
    </div>
  );
}
