import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import Navbar from './components/Navbar'
import BlogCard from './components/BlogCard'
import MyBlogs from './pages/MyBlogs'

export default function App () {
  return (
    <>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/login" element={<Login />}></Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/my-blogs" element={<MyBlogs />}></Route>
            <Route path="/blog-card" element={<BlogCard />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}