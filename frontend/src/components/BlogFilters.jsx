import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function BlogFilters({
  search,
  sort,
  setSearch,
  setSort,
  setStatus,
}) {
  const { user } = useAuth();
  const location = useLocation();
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
                <Link
                  to="/"
                  onClick={() => setStatus("unpublished")}
                  className="bg-black hover:bg-gray-900 px-4 py-2 rounded-md text-white font-semibold"
                >
                  All Blogs
                </Link>
                <Link
                  to="/my-blogs"
                  onClick={() => setStatus("unpublished")}
                  className="bg-black hover:bg-gray-900 px-4 py-2 rounded-md text-white font-semibold"
                >
                  Unpublished Blogs
                </Link>
              </>
            )}
            <Link
              to="/my-blogs"
              onClick={() => setStatus("published")}
              className="bg-black hover:bg-gray-900 px-4 py-2 rounded-md text-white font-semibold"
            >
              My Blogs
            </Link>

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
