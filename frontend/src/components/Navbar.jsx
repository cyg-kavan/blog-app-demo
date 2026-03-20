import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full top-0 z-10 bg-white shadow-sm fixed">
      <div className="flex items-center justify-between h-16 mx-4 px-4">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold">
          Logo
        </Link>

        {/* Desktop Navbar View */}
        <div className="hidden md:flex items-center space-x-6">
          {!user ? (
            <>
              <Link
                to="/signup"
                className="bg-green-700 hover:bg-green-600 rounded-md px-4 py-2 text-white text-lg font-semibold"
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className="bg-black hover:bg-gray-900 rounded-md px-4 py-2 text-white text-lg font-semibold"
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="hover:text-gray-600 text-lg font-semibold px-2">
                Profile
              </Link>
              <Link
                to="/"
                className="bg-black hover:bg-gray-900 rounded-md px-4 py-2 text-white font-semibold text-lg"
                onClick={logout}
              >
                Logout
              </Link>
            </>
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

          <Link to="/profile" className="text-black text-lg font-semibold px-4 block">
            Profile
          </Link>

          {!user ? (
            <Link
              to="/login"
              className="bg-black hover:bg-gray-900 rounded-md ml-3 px-4 py-1 text-white text-lg font-semibold"
            >
              Login
            </Link>
          ) : (
            <Link
              to="/"
              className="bg-black hover:bg-gray-900 rounded-md ml-3 px-4 py-1 text-white text-lg font-semibold"
              onClick={logout}
            >
              Logout
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
