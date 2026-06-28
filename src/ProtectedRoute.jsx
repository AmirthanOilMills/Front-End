import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
      </div>
    );
  }

  // After loading, if user still not available → redirect
  if (!user) {
    if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If trying to access admin dashboard, ensure the user is an admin
  if (location.pathname.startsWith("/admin") && user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
