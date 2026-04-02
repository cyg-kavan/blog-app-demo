import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { checkAuthentication } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    // try {
    //   const result = await login({ email, password });
    //   alert("Login successful")
    //   navigate("/home")
    // } catch (error) {
    //   console.error("Login error", error.message);
    // }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/login",
        { email, password },
        { withCredentials: true }
      );

      await checkAuthentication();

      toast.success(response.data.message);
      navigate("/my-blogs");
    } catch (error) {
      console.error(
        "Login error: ",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Something went wrong", {
        duration: 6000,
      });
    }
  };
  return (
    <>
      <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">
            Login to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="bg-white shadow-lg p-7 rounded-md hover:shadow-gray-400">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm/6 font-medium text-black-100">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    name="email"
                    type="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-2 -outline-offset-1 outline-black placeholder:text-black focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm/6 font-medium text-black-100">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    name="password"
                    type="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-2 -outline-offset-1 outline-black placeholder:text-black focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-gray-900 cursor-pointer"
                >
                  Login
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm/6 text-black">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-black hover:text-gray-700"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
