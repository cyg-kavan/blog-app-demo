import React from "react";

export default function BlogFilters({ search, sort, setSearch, setSort }) {
  return (
    <div className="flex justify-between items-center mt-10 px-24">
      <input
        className="bg-gray-100 w-125 h-10 rounded-3xl shadow-lg hover:shadow-gray-300 p-6 outline-none "
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="bg-gray-100 hover:shadow-gray-300 h-10 px-2 rounded-3xl outline-none shadow-md mr-32"
        value={sort}
        onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort By</option>
            <option value="title-asc">Title(A-Z)</option>
            <option value="title-desc">Title(Z-A)</option>
            <option value="name-asc">Author Name(A-Z)</option>
            <option value="name-desc">Author Name(Z-A)</option>
            <option value="createdAt-asc">Oldest</option>
            <option value="createdAt-desc">Newest</option>
        </select>
    </div>
  );
}
