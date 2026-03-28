import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
// import { useState } from "react";

export default function BlogFilters({
  search,
  sort,
  setSearch,
  setSort,
  status,
  setStatus,
}) {
  const { user } = useAuth();
  const location = useLocation();

  // const [activeButton, setActiveButton] = useState("all")
  const buttons = [
    {label: "All", value: "all"},
    {label: "Published", value: "published"},
    {label: "Unpublished", value: "unpublished"},
  ]
  
  return (
    <div className="flex justify-between items-center mt-30 px-24">
      <div>
        <input
          className="bg-gray-100 w-125 h-10 rounded-md shadow-lg hover:shadow-gray-300 p-6 outline-none "
          type="text"
          placeholder="Search here..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        {user && (
          <>
            {location.pathname === "/my-blogs" && (
              <>
                <div
                  className="inline-flex bg-gray-100 rounded-md shadow-lg hover:shadow-gray-300 p-1"
                  role="group"
                >
                  {/* <button
                    onClick={() => setStatus("all")}
                    className="bg-white hover:font-semibold focus:ring-2 focus:ring-gray-200 rounded-l-md px-3 py-2 focus:outline-none"
                  >
                    All
                  </button>
                  <button
                    onClick={() => setStatus("published")}
                    className="bg-white hover:font-semibold focus:ring-2 focus:ring-gray-200 px-3 py-2 focus:outline-none"
                  >
                    Published
                  </button>
                  <button
                    onClick={() => setStatus("unpublished")}
                    className="bg-white hover:font-semibold focus:ring-2 focus:ring-gray-200 rounded-r-md px-3 py-2 focus:outline-none"
                  >
                    Unpublished
                  </button> */}

                  {buttons.map((button) => (
                    <button
                      key={button.value}
                      onClick={() => {setStatus(button.value)}}
                      className={`px-3 py-1 focus:outline-none cursor-pointer ${
                        status === button.value
                          ? "bg-black text-white hover:font-semibold focus:ring-2 focus:ring-gray-200 rounded-md font-semibold"
                          : "bg-white focus:ring-2 focus:ring-gray-200"
                        }`}
                    >
                      {button.label}
                    </button>
                  )
                  )}
                </div>
              </>
            )}

            {location.pathname === "/" && (
              <Link
                to="/my-blogs"
                className="bg-black hover:bg-gray-900 px-4 py-2 rounded-md text-white font-semibold"
              >
                My Blogs
              </Link>
            )}

            {user.role !== "viewer" && (
              <Link
                to="/create-blog"
                className="bg-black hover:bg-gray-900 px-4 py-2 rounded-md text-white font-semibold"
              >
                Write Blog
              </Link>
            )}
          </>
        )}

        <select
          className="bg-gray-100 hover:shadow-gray-300 h-10 px-2 rounded-md outline-none shadow-md mr-32"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="title-asc">Title(A-Z)</option>
          <option value="title-desc">Title(Z-A)</option>
          <option value="name-asc">Author Name(A-Z)</option>
          <option value="name-desc">Author Name(Z-A)</option>
          <option value="createdAt-asc">Oldest</option>
          <option value="createdAt-desc">Newest</option>
        </select>
      </div>
    </div>
  );
}
