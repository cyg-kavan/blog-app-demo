import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="flex items-center justify-between h-16 mx-4 px-4">
        {/* Logo */}
        <div className="text-3xl font-bold">Logo</div>

        {/* Desktop Navbar View */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/home" className="hover:text-gray-600 text-lg px-2">
            Home
          </Link>

          <Link to="/home" className="hover:text-gray-600 text-lg px-2">
            Write Blog
          </Link>

          {!user ? (
            <button
              to="/home"
              className="bg-black hover:bg-gray-900 rounded-md px-4 py-2 text-white text-lg"
            >
              Login
            </button>
          ) : (
            <button
              to="/home"
              className="bg-black hover:bg-gray-900 rounded-md px-4 py-2 text-white text-lg"
              onClick={logout}
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>

      {/* Mobile Navbar View */}
      {isOpen && (
        <div className="md:hidden bg-gray-100 space-y-3 p-3">
          <Link to="/home" className="text-black text-lg px-4 block">
            Home
          </Link>

          <Link to="/home" className="text-black text-lg px-4 block">
            Write Blog
          </Link>

          {!user ? (
            <button
              to="/home"
              className="bg-black hover:bg-gray-900 rounded-md ml-3 px-4 py-1 text-white text-lg"
            >
              Login
            </button>
          ) : (
            <button
              to="/home"
              className="bg-black hover:bg-gray-900 rounded-md ml-3 px-4 py-1 text-white text-lg"
              onClick={logout}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}