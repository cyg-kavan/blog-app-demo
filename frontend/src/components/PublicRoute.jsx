import React from "react";
import { useAuth } from "../contexts/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const { user } = useAuth();

  return user ? <Navigate to="/home" /> : <Outlet />;
}
