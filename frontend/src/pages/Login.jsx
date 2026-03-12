import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth';
import axios from 'axios';

export default function Login () {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
      const response = await axios.post("http://localhost:8000/api/users/login",
        { email, password },
        { withCredentials: true }
      )

      await checkAuthentication();

      alert("Login successful")
      navigate("/my-blogs")
    } catch (error) {
      console.error("Login error", error.message);
    }
  }
  return (
    <>
      <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">Login to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm/6 font-medium text-black-100">Email address</label>
              <div className="mt-2">
                <input
                  name="email"
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-2 -outline-offset-1 outline-black placeholder:text-black focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm/6 font-medium text-black-100">Password</label>
              <div className="mt-2">
                <input
                  name="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-2 -outline-offset-1 outline-black placeholder:text-black focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-cyan-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-cyan-400"
              >
                Login
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-black">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-cyan-400 hover:text-cyan-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}