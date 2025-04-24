import { RootState } from "../stores/store";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

interface AuthGuardProps {
  role: string;
  children?: React.ReactNode; // Allow passing children for flexibility
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ role, children }) => {
  const { token, user } = useSelector((state: RootState) => state.auth);

  // Redirect to login if no token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Ensure user exists and has the correct role
  if (!user || user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  // Render children if provided, otherwise render Outlet
  return children ? <>{children}</> : <Outlet />;
};
