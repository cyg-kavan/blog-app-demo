import axios from "axios";
import React, { useEffect, useState } from "react";
import BlogListGrid from "../components/BlogListGrid";
import BlogFilters from "../components/BlogFilters";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/blogs?search=${search}&sort=${sort}&order=&page=1&limit=10`
        );
        console.log(response.data.blogs);
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBlogs();
  }, [search, sort]);
  return (
    <>
      <BlogFilters 
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
      />
      
      <BlogListGrid blogs={blogs} />
    </>
  );
}
